"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import {
    RESOURCES as RESOURCES_FALLBACK,
    GALLERY_CONTENT as GALLERY_CONTENT_FALLBACK,
} from "../lib/content";
import { getById } from "@/services/firebase/content";

// ==================== TIPOS ====================
interface ResourceItem {
    id: string;
    src: string;
    type: "image" | "video";
    title?: string;
    subtitle?: string;
    note?: string;
    metadata?: Record<string, any>;
    active?: boolean;
    _idx?: number;
}

interface MediaOverlayProps {
    resource: ResourceItem;
    isExpanded: boolean;
    isTapActive: boolean;
    onToggleExpanded: (id: string) => void;
    onToggleTap: (id: string | null) => void;
}

interface MediaCardProps {
    resource: ResourceItem;
    onSelect: (src: string, type: "image" | "video") => void;
    overlayContent: React.ReactNode;
}

interface LightboxProps {
    selected: { src: string; type: "image" | "video" } | null;
    onClose: () => void;
}

// ==================== SUB-COMPONENTES ====================

/**
 * Componente de video con control de volumen
 */
function VideoWithVolumeControl({
    src,
    className,
    onClick,
    autoPlay = true,
}: {
    src: string;
    className?: string;
    onClick?: () => void;
    autoPlay?: boolean;
}) {
    const [isMuted, setIsMuted] = useState(true);
    const videoRef = useRef<HTMLVideoElement>(null);

    const toggleMute = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    return (
        <div className="relative w-full h-full group">
            <video
                ref={videoRef}
                src={src}
                className={className}
                muted={isMuted}
                playsInline
                loop
                autoPlay={autoPlay}
                onClick={onClick}
            />
            {/* Botón de volumen - siempre visible con z-index alto para estar sobre overlays */}
            <button
                onClick={toggleMute}
                className="absolute top-3 right-3 z-50 bg-black/70 hover:bg-black/90 text-white p-2.5 rounded-full transition-all shadow-lg backdrop-blur-sm pointer-events-auto"
                aria-label={isMuted ? "Activar sonido" : "Desactivar sonido"}
            >
                {isMuted ? (
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                        />
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
                        />
                    </svg>
                ) : (
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                        />
                    </svg>
                )}
            </button>
        </div>
    );
}

/**
 * Muestra los metadatos de un recurso con opción de expandir/colapsar
 */
function MetadataList({
    metadata,
    resourceId,
    isExpanded,
    onToggle,
}: {
    metadata: Record<string, any>;
    resourceId: string;
    isExpanded: boolean;
    onToggle: (id: string) => void;
}) {
    const entries = Object.entries(metadata || {});
    const visible = isExpanded ? entries : entries.slice(0, 2);

    if (entries.length === 0) return null;

    return (
        <div className="mt-3 text-xs text-white/95">
            <div className="space-y-1">
                {visible.map(([k, v]) => (
                    <div
                        key={k}
                        className="flex justify-between items-baseline"
                    >
                        <span className="text-white capitalize">
                            {k.replace(/_/g, " ")}
                        </span>
                        <span className="font-medium">{String(v)}</span>
                    </div>
                ))}
            </div>

            {entries.length > 2 && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggle(resourceId);
                    }}
                    className="mt-2 text-primary text-xs font-medium underline"
                    aria-expanded={isExpanded}
                >
                    {isExpanded
                        ? "Ver menos"
                        : `Ver más (${entries.length - 2})`}
                </button>
            )}
        </div>
    );
}

/**
 * Overlay de información que aparece sobre el recurso (móvil y desktop)
 */
function MediaOverlay({
    resource,
    isExpanded,
    isTapActive,
    onToggleExpanded,
    onToggleTap,
}: MediaOverlayProps) {
    return (
        <button
            className="absolute inset-0 group pointer-events-none"
            onClick={() => onToggleTap(isTapActive ? null : resource.id)}
            aria-label={`Mostrar información de ${resource.title || "recurso"}`}
        >
            {/* Gradiente de oscurecimiento - ahora con pointer-events-auto solo aquí */}
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/50 to-black/10 group-hover:opacity-100 transition-opacity duration-300 pointer-events-auto"></div>

            {/* Contenido de información */}
            <div
                className={`absolute left-0 right-0 bottom-0 p-4 text-white transform transition-all duration-300 pointer-events-auto ${
                    isTapActive
                        ? "translate-y-0 opacity-100"
                        : "translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100"
                }`}
            >
                <div className="font-semibold text-lg leading-tight">
                    {resource.title}
                </div>
                {resource.subtitle && (
                    <div className="text-sm opacity-80">
                        {resource.subtitle}
                    </div>
                )}

                {resource.metadata && (
                    <MetadataList
                        metadata={resource.metadata}
                        resourceId={resource.id}
                        isExpanded={isExpanded}
                        onToggle={onToggleExpanded}
                    />
                )}
            </div>
        </button>
    );
}

/**
 * Tarjeta de recurso (imagen o video) con overlay
 */
function MediaCard({ resource, onSelect, overlayContent }: MediaCardProps) {
    return (
        <div className="relative h-96 sm:h-100 md:h-64 md:sm:h-112">
            {resource.type === "image" ? (
                <Image
                    src={resource.src}
                    alt={resource.title || "imagen"}
                    fill
                    className="object-cover cursor-pointer"
                    onClick={() => onSelect(resource.src, "image")}
                />
            ) : (
                <VideoWithVolumeControl
                    src={resource.src}
                    className="w-full h-full object-cover cursor-pointer"
                    onClick={() => onSelect(resource.src, "video")}
                />
            )}
            {overlayContent}
        </div>
    );
}

/**
 * Carrusel móvil con controles de navegación
 */
function MobileCarousel({
    resources,
    listRef,
    expandedMap,
    tapOverlay,
    onToggleExpanded,
    onToggleTap,
    onSelect,
}: {
    resources: ResourceItem[];
    listRef: React.RefObject<HTMLDivElement>;
    expandedMap: Record<string, boolean>;
    tapOverlay: string | null;
    onToggleExpanded: (id: string) => void;
    onToggleTap: (id: string | null) => void;
    onSelect: (src: string, type: "image" | "video") => void;
}) {
    const scrollCarousel = (direction: "prev" | "next") => {
        const container = listRef.current;
        if (!container) return;

        const scrollAmount = container.clientWidth * 0.8;
        container.scrollBy({
            left: direction === "prev" ? -scrollAmount : scrollAmount,
            behavior: "smooth",
        });
    };

    return (
        <div className="md:hidden">
            <div className="relative">
                <div
                    ref={listRef}
                    className="overflow-x-auto snap-x snap-mandatory flex gap-4 pb-4"
                    role="list"
                >
                    {resources.map((resource) => (
                        <article
                            key={resource.id}
                            role="listitem"
                            className="shrink-0 w-[80%] sm:w-[60%] snap-center"
                        >
                            <div className="rounded-lg overflow-hidden bg-background/50 border border-border">
                                <MediaCard
                                    resource={resource}
                                    onSelect={onSelect}
                                    overlayContent={
                                        <MediaOverlay
                                            resource={resource}
                                            isExpanded={
                                                !!expandedMap[resource.id]
                                            }
                                            isTapActive={
                                                tapOverlay === resource.id
                                            }
                                            onToggleExpanded={onToggleExpanded}
                                            onToggleTap={onToggleTap}
                                        />
                                    }
                                />
                                {resource.note && (
                                    <div className="p-3 text-foreground/60 text-sm">
                                        {resource.note}
                                    </div>
                                )}
                            </div>
                        </article>
                    ))}
                </div>

                {/* Controles de navegación */}
                <div className="absolute inset-y-0 left-2 flex items-center">
                    <button
                        aria-label="Anterior"
                        onClick={() => scrollCarousel("prev")}
                        className="bg-background/80 backdrop-blur-sm p-2 rounded-full border border-border hover:bg-background transition-colors"
                    >
                        ‹
                    </button>
                </div>
                <div className="absolute inset-y-0 right-2 flex items-center">
                    <button
                        aria-label="Siguiente"
                        onClick={() => scrollCarousel("next")}
                        className="bg-background/80 backdrop-blur-sm p-2 rounded-full border border-border hover:bg-background transition-colors"
                    >
                        ›
                    </button>
                </div>
            </div>
        </div>
    );
}

/**
 * Grid de escritorio (3 columnas)
 */
function DesktopGrid({
    resources,
    expandedMap,
    onToggleExpanded,
    onSelect,
}: {
    resources: ResourceItem[];
    expandedMap: Record<string, boolean>;
    onToggleExpanded: (id: string) => void;
    onSelect: (src: string, type: "image" | "video") => void;
}) {
    return (
        <div className="hidden md:grid md:grid-cols-3 gap-6">
            {resources.map((resource) => (
                <article
                    key={resource.id}
                    className="rounded-lg overflow-hidden bg-background/50 border border-border"
                >
                    <div className="relative h-64 sm:h-112">
                        {resource.type === "image" ? (
                            <Image
                                src={resource.src}
                                alt={resource.title || "imagen"}
                                fill
                                className="object-cover cursor-pointer"
                                onClick={() => onSelect(resource.src, "image")}
                            />
                        ) : (
                            <VideoWithVolumeControl
                                src={resource.src}
                                className="w-full h-full object-cover cursor-pointer"
                                onClick={() => onSelect(resource.src, "video")}
                            />
                        )}

                        <div className="absolute inset-0 bg-black/0 hover:bg-black/60 transition-colors duration-200 flex items-end opacity-0 hover:opacity-100">
                            <div className="p-4 text-white w-full">
                                <div className="font-semibold text-lg">
                                    {resource.title}
                                </div>
                                {resource.subtitle && (
                                    <div className="text-sm opacity-80">
                                        {resource.subtitle}
                                    </div>
                                )}

                                {resource.metadata && (
                                    <MetadataList
                                        metadata={resource.metadata}
                                        resourceId={resource.id}
                                        isExpanded={!!expandedMap[resource.id]}
                                        onToggle={onToggleExpanded}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                    {resource.note && (
                        <div className="p-4 text-foreground/60 text-sm">
                            {resource.note}
                        </div>
                    )}
                </article>
            ))}
        </div>
    );
}

/**
 * Modal Lightbox para ver recursos en pantalla completa
 */
function Lightbox({ selected, onClose }: LightboxProps) {
    const [isMuted, setIsMuted] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    const toggleMute = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    if (!selected) return null;

    return (
        <div
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div
                className="relative max-w-4xl w-full"
                onClick={(e) => e.stopPropagation()}
            >
                {selected.type === "image" ? (
                    <img
                        src={selected.src}
                        alt="recurso"
                        className="w-full h-auto rounded-lg"
                    />
                ) : (
                    <div className="relative">
                        <video
                            ref={videoRef}
                            src={selected.src}
                            className="w-full h-auto rounded-lg"
                            controls
                            autoPlay
                            muted={isMuted}
                        />
                        {/* Botón de volumen para lightbox */}
                        <button
                            onClick={toggleMute}
                            className="absolute top-4 left-4 z-10 bg-black/60 hover:bg-black/80 text-white p-3 rounded-full transition-all"
                            aria-label={
                                isMuted ? "Activar sonido" : "Desactivar sonido"
                            }
                        >
                            {isMuted ? (
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
                                    />
                                </svg>
                            ) : (
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                                    />
                                </svg>
                            )}
                        </button>
                    </div>
                )}
                <button
                    className="absolute top-4 right-4 text-primary hover:text-primary-dark transition-colors"
                    onClick={onClose}
                    aria-label="Cerrar vista completa"
                >
                    <span className="text-3xl">✕</span>
                </button>
            </div>
        </div>
    );
}

// ==================== COMPONENTE PRINCIPAL ====================

export default function Gallery() {
    // Estados
    const [selected, setSelected] = useState<{
        src: string;
        type: "image" | "video";
    } | null>(null);
    const [tapOverlay, setTapOverlay] = useState<string | null>(null);
    const [expandedMap, setExpandedMap] = useState<Record<string, boolean>>({});
    const [resources, setResources] = useState<ResourceItem[]>([
        ...RESOURCES_FALLBACK,
    ]);
    const [galleryTitle, setGalleryTitle] = useState<string>(
        GALLERY_CONTENT_FALLBACK.title
    );
    const [galleryNote, setGalleryNote] = useState<string>(
        GALLERY_CONTENT_FALLBACK.note
    );

    const listRef = useRef<HTMLDivElement | null>(null);

    // Handlers
    const toggleExpanded = (id: string) => {
        setExpandedMap((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const handleSelectMedia = (src: string, type: "image" | "video") => {
        setSelected({ src, type });
    };

    // Cargar datos de Firebase
    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const data = await getById<any>("resources", "main");
                if (!mounted) return;
                setResources(data?.RESOURCES ?? RESOURCES_FALLBACK);
                setGalleryTitle(
                    data?.GALLERY_TITLE ?? GALLERY_CONTENT_FALLBACK.title
                );
                setGalleryNote(
                    data?.GALLERY_NOTE ?? GALLERY_CONTENT_FALLBACK.note
                );
            } catch (e) {
                setResources(RESOURCES_FALLBACK);
                setGalleryTitle(GALLERY_CONTENT_FALLBACK.title);
                setGalleryNote(GALLERY_CONTENT_FALLBACK.note);
            }
        })();
        return () => {
            mounted = false;
        };
    }, []);

    // Filtrar recursos activos
    const visibleResources = resources
        .map((r, i) => ({ ...r, _idx: i }))
        .filter((r) => r.active !== false);

    return (
        <section id="gallery" className="py-20 px-4 bg-background">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-8">
                    <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-2">
                        ✦ Galería
                    </p>
                    <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
                        {galleryTitle}
                    </h2>
                    <p className="text-foreground/60 mt-2">{galleryNote}</p>
                </div>

                {/* Carrusel Móvil */}
                <MobileCarousel
                    resources={visibleResources}
                    listRef={listRef}
                    expandedMap={expandedMap}
                    tapOverlay={tapOverlay}
                    onToggleExpanded={toggleExpanded}
                    onToggleTap={setTapOverlay}
                    onSelect={handleSelectMedia}
                />

                {/* Grid Desktop */}
                <DesktopGrid
                    resources={visibleResources}
                    expandedMap={expandedMap}
                    onToggleExpanded={toggleExpanded}
                    onSelect={handleSelectMedia}
                />
            </div>

            {/* Lightbox */}
            <Lightbox selected={selected} onClose={() => setSelected(null)} />
        </section>
    );
}

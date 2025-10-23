"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import { RESOURCES, GALLERY_NOTE } from "../lib/content";

export default function Gallery() {
    const [selected, setSelected] = useState<{
        src: string;
        type: "image" | "video";
    } | null>(null);
    const [tapOverlay, setTapOverlay] = useState<string | null>(null);
    const [expandedMap, setExpandedMap] = useState<Record<string, boolean>>({});
    const toggleExpanded = (id: string) => {
        setExpandedMap((prev) => ({ ...prev, [id]: !prev[id] }));
    };
    const listRef = useRef<HTMLDivElement | null>(null);

    return (
        <section id="gallery" className="py-20 px-4 bg-background">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-8">
                    <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-2">
                        ✦ Galería
                    </p>
                    <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
                        Fotos reales y mini videos
                    </h2>
                    <p className="text-foreground/60 mt-2">{GALLERY_NOTE}</p>
                </div>

                {/* Mobile carousel */}
                <div className="md:hidden">
                    <div className="relative">
                        <div
                            ref={listRef}
                            className="overflow-x-auto snap-x snap-mandatory flex gap-4 pb-4"
                            role="list"
                        >
                            {RESOURCES.map((r) => (
                                <article
                                    key={r.id}
                                    role="listitem"
                                    className="shrink-0 w-[80%] sm:w-[60%] snap-center"
                                >
                                    <div className="rounded-lg overflow-hidden bg-background/50 border border-border">
                                        <div className="relative h-56 sm:h-72">
                                            {r.type === "image" ? (
                                                <Image
                                                    src={r.src}
                                                    alt={r.title || "imagen"}
                                                    fill
                                                    className="object-cover"
                                                    onClick={() =>
                                                        setSelected({
                                                            src: r.src,
                                                            type: "image",
                                                        })
                                                    }
                                                />
                                            ) : (
                                                <video
                                                    src={r.src}
                                                    className="w-full h-full object-cover"
                                                    muted
                                                    playsInline
                                                    loop
                                                    onClick={() =>
                                                        setSelected({
                                                            src: r.src,
                                                            type: "video",
                                                        })
                                                    }
                                                />
                                            )}

                                            {/* Overlay */}
                                            <button
                                                className="absolute inset-0 group"
                                                onClick={() =>
                                                    setTapOverlay(
                                                        tapOverlay === r.id
                                                            ? null
                                                            : r.id
                                                    )
                                                }
                                                aria-label={`Mostrar información de ${
                                                    r.title || "recurso"
                                                }`}
                                            >
                                                {/* subtle gradient to darken image on hover/tap */}
                                                <div className="absolute inset-0 bg-linear-to-t from-black/10 via-black/20 to-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                                <div
                                                    className={`absolute left-0 right-0 bottom-0 p-4 text-white transform transition-all duration-300 ${
                                                        tapOverlay === r.id
                                                            ? "translate-y-0 opacity-100"
                                                            : "translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100"
                                                    }`}
                                                >
                                                    <div className="font-semibold text-lg leading-tight">
                                                        {r.title}
                                                    </div>
                                                    {r.subtitle && (
                                                        <div className="text-sm opacity-80">
                                                            {r.subtitle}
                                                        </div>
                                                    )}

                                                    {/* Metadata key:value list (show first 2, expandable) */}
                                                    {r.metadata &&
                                                        (() => {
                                                            const entries =
                                                                Object.entries(
                                                                    r.metadata ||
                                                                        {}
                                                                );
                                                            const isExpanded =
                                                                !!expandedMap[
                                                                    r.id
                                                                ];
                                                            const visible =
                                                                isExpanded
                                                                    ? entries
                                                                    : entries.slice(
                                                                          0,
                                                                          2
                                                                      );
                                                            return (
                                                                <div className="mt-3 text-xs text-white/95">
                                                                    <div className="space-y-1">
                                                                        {visible.map(
                                                                            ([
                                                                                k,
                                                                                v,
                                                                            ]) => (
                                                                                <div
                                                                                    key={
                                                                                        k
                                                                                    }
                                                                                    className="flex justify-between items-baseline"
                                                                                >
                                                                                    <span className="text-foreground/40 capitalize">
                                                                                        {k.replace(
                                                                                            /_/g,
                                                                                            " "
                                                                                        )}
                                                                                    </span>
                                                                                    <span className="font-medium">
                                                                                        {String(
                                                                                            v
                                                                                        )}
                                                                                    </span>
                                                                                </div>
                                                                            )
                                                                        )}
                                                                    </div>

                                                                    {entries.length >
                                                                        2 && (
                                                                        <button
                                                                            onClick={(
                                                                                e
                                                                            ) => {
                                                                                e.stopPropagation();
                                                                                toggleExpanded(
                                                                                    r.id
                                                                                );
                                                                            }}
                                                                            className="mt-2 text-primary text-xs font-medium underline"
                                                                            aria-expanded={
                                                                                isExpanded
                                                                            }
                                                                        >
                                                                            {isExpanded
                                                                                ? "Ver menos"
                                                                                : `Ver más (${
                                                                                      entries.length -
                                                                                      2
                                                                                  })`}
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            );
                                                        })()}
                                                </div>
                                            </button>
                                        </div>
                                        {r.note && (
                                            <div className="p-3 text-foreground/60 text-sm">
                                                {r.note}
                                            </div>
                                        )}
                                    </div>
                                </article>
                            ))}
                        </div>

                        {/* Controls */}
                        <div className="absolute inset-y-0 left-2 flex items-center">
                            <button
                                aria-label="Anterior"
                                onClick={() => {
                                    const c = listRef.current;
                                    if (c)
                                        c.scrollBy({
                                            left: -c.clientWidth * 0.8,
                                            behavior: "smooth",
                                        });
                                }}
                                className="bg-background/80 backdrop-blur-sm p-2 rounded-full border border-border"
                            >
                                ‹
                            </button>
                        </div>
                        <div className="absolute inset-y-0 right-2 flex items-center">
                            <button
                                aria-label="Siguiente"
                                onClick={() => {
                                    const c = listRef.current;
                                    if (c)
                                        c.scrollBy({
                                            left: c.clientWidth * 0.8,
                                            behavior: "smooth",
                                        });
                                }}
                                className="bg-background/80 backdrop-blur-sm p-2 rounded-full border border-border"
                            >
                                ›
                            </button>
                        </div>
                    </div>
                </div>

                {/* Desktop grid */}
                <div className="hidden md:grid md:grid-cols-3 gap-6">
                    {RESOURCES.map((r) => (
                        <article
                            key={r.id}
                            className="rounded-lg overflow-hidden bg-background/50 border border-border"
                        >
                            <div className="relative h-64">
                                {r.type === "image" ? (
                                    <Image
                                        src={r.src}
                                        alt={r.title || "imagen"}
                                        fill
                                        className="object-cover"
                                        onClick={() =>
                                            setSelected({
                                                src: r.src,
                                                type: "image",
                                            })
                                        }
                                    />
                                ) : (
                                    <video
                                        src={r.src}
                                        className="w-full h-full object-cover"
                                        muted
                                        playsInline
                                        loop
                                        onClick={() =>
                                            setSelected({
                                                src: r.src,
                                                type: "video",
                                            })
                                        }
                                    />
                                )}

                                <div className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-colors duration-200 flex items-end opacity-0 hover:opacity-100">
                                    <div className="p-4 text-white w-full">
                                        <div className="font-semibold text-lg">
                                            {r.title}
                                        </div>
                                        {r.subtitle && (
                                            <div className="text-sm opacity-80">
                                                {r.subtitle}
                                            </div>
                                        )}

                                        {/* desktop: metadata preview + expand */}
                                        {r.metadata &&
                                            (() => {
                                                const entries = Object.entries(
                                                    r.metadata || {}
                                                );
                                                const isExpanded =
                                                    !!expandedMap[r.id];
                                                const visible = isExpanded
                                                    ? entries
                                                    : entries.slice(0, 2);
                                                return (
                                                    <div className="mt-3 text-xs text-white/95">
                                                        <div className="space-y-1">
                                                            {visible.map(
                                                                ([k, v]) => (
                                                                    <div
                                                                        key={k}
                                                                        className="flex justify-between items-baseline"
                                                                    >
                                                                        <span className="text-foreground/40 capitalize">
                                                                            {k.replace(
                                                                                /_/g,
                                                                                " "
                                                                            )}
                                                                        </span>
                                                                        <span className="font-medium">
                                                                            {String(
                                                                                v
                                                                            )}
                                                                        </span>
                                                                    </div>
                                                                )
                                                            )}
                                                        </div>
                                                        {entries.length > 2 && (
                                                            <button
                                                                onClick={(
                                                                    e
                                                                ) => {
                                                                    e.stopPropagation();
                                                                    toggleExpanded(
                                                                        r.id
                                                                    );
                                                                }}
                                                                className="mt-2 text-primary text-xs font-medium underline"
                                                                aria-expanded={
                                                                    isExpanded
                                                                }
                                                            >
                                                                {isExpanded
                                                                    ? "Ver menos"
                                                                    : `Ver más (${
                                                                          entries.length -
                                                                          2
                                                                      })`}
                                                            </button>
                                                        )}
                                                    </div>
                                                );
                                            })()}
                                    </div>
                                </div>
                            </div>
                            {r.note && (
                                <div className="p-4 text-foreground/60 text-sm">
                                    {r.note}
                                </div>
                            )}
                        </article>
                    ))}
                </div>
            </div>

            {/* Lightbox */}
            {selected && (
                <div
                    className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
                    onClick={() => setSelected(null)}
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
                            <video
                                src={selected.src}
                                className="w-full h-auto rounded-lg"
                                controls
                                autoPlay
                            />
                        )}
                        <button
                            className="absolute top-4 right-4 text-primary hover:text-primary-dark transition-colors"
                            onClick={() => setSelected(null)}
                        >
                            <span className="text-3xl">✕</span>
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
}

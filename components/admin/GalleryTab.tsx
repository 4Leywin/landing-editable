"use client";
import { useEffect, useState, useRef } from "react";
import { DEFAULT_CONTENT } from "../../lib/content";
import { db } from "@/services/firebase/client";
import { doc, getDoc, setDoc } from "firebase/firestore";
import toast from "react-hot-toast";
import { uploadImageFile, uploadVideoFile } from "@/services/cloudinary";

type Resource = {
    id: string;
    type: string; // 'image' | 'video' or other string coming from stored data
    src: string;
    title?: string;
    subtitle?: string;
    note?: string;
    alt?: string;
    caption?: string;
    href?: string;
    order?: number;
    active?: boolean;
    public_id?: string;
    metadata?: Record<string, any>;
};

export default function GalleryTab() {
    const [resources, setResources] = useState<Resource[]>(
        DEFAULT_CONTENT.RESOURCES
    );
    const [galleryTitle, setGalleryTitle] = useState<string>(
        DEFAULT_CONTENT.GALLERY_CONTENT.title
    );
    const [galleryNote, setGalleryNote] = useState<string>(
        DEFAULT_CONTENT.GALLERY_CONTENT.note
    );
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        let mounted = true;
        async function load() {
            try {
                const snap = await getDoc(doc(db, "resources", "main"));
                const data = snap.exists() ? (snap.data() as any) : null;
                if (!mounted) return;
                setResources(data?.RESOURCES ?? DEFAULT_CONTENT.RESOURCES);
                setGalleryTitle(
                    data?.GALLERY_TITLE ?? DEFAULT_CONTENT.GALLERY_CONTENT.title
                );
                setGalleryNote(
                    data?.GALLERY_NOTE ?? DEFAULT_CONTENT.GALLERY_CONTENT.note
                );
                setIsLoaded(true);
            } catch (err) {
                setResources(DEFAULT_CONTENT.RESOURCES);
                setGalleryTitle(DEFAULT_CONTENT.GALLERY_CONTENT.title);
                setGalleryNote(DEFAULT_CONTENT.GALLERY_CONTENT.note);
                setIsLoaded(true);
            }
        }
        load();
        return () => {
            mounted = false;
        };
    }, []);

    async function addResourceFromFile(file: File) {
        const id = `r${Date.now()}`;
        const type = file.type.startsWith("video") ? "video" : "image";
        const uploadingToastId = toast.loading("Subiendo archivo...");
        try {
            let url = "";
            if (type === "image") {
                url = await uploadImageFile(file, "gallery");
            } else {
                url = await uploadVideoFile(file, "gallery");
            }

            const newItems = [
                ...resources,
                {
                    id,
                    type,
                    src: url,
                    title: file.name,
                    subtitle: "",
                    note: "",
                    alt: "",
                    caption: "",
                    href: "",
                    order: resources.length,
                    active: true,
                    public_id: undefined,
                },
            ];
            setResources(newItems);
            await setDoc(doc(db, "resources", "main"), {
                RESOURCES: newItems,
                GALLERY_TITLE: galleryTitle,
                GALLERY_NOTE: galleryNote,
            });
            toast.dismiss(uploadingToastId);
            toast.success("Archivo subido y galería actualizada");
        } catch (e: any) {
            toast.dismiss(uploadingToastId);
            toast.error("Error subiendo archivo: " + (e?.message || String(e)));
        }
    }

    async function addEmptyResource() {
        const id = `r${Date.now()}`;
        const newItem: Resource = {
            id,
            type: "image",
            src: "",
            title: "Nuevo recurso",
            subtitle: "",
            alt: "",
            caption: "",
            href: "",
            order: resources.length,
            active: true,
        };
        const toastId = toast.loading("Añadiendo recurso...");
        try {
            const newItems = [...resources, newItem];
            setResources(newItems);
            await setDoc(doc(db, "resources", "main"), {
                RESOURCES: newItems,
                GALLERY_TITLE: galleryTitle,
                GALLERY_NOTE: galleryNote,
            });
            toast.dismiss(toastId);
            toast.success("Recurso añadido");
        } catch (e: any) {
            toast.dismiss(toastId);
            toast.error(
                "Error guardando galería: " + (e?.message || String(e))
            );
        }
    }

    // Logical delete: toggle active flag instead of removing from array
    function toggleActive(idx: number) {
        const newItems = resources.map((r, i) =>
            i === idx ? { ...r, active: !r.active } : r
        );
        setResources(newItems);
        // persist change silently (errors shown)
        setDoc(doc(db, "resources", "main"), {
            RESOURCES: newItems,
            GALLERY_TITLE: galleryTitle,
            GALLERY_NOTE: galleryNote,
        }).catch((e) => toast.error("Error guardando galería: " + String(e)));
    }

    function updateResource(idx: number, field: string, value: any) {
        const newItems = resources.map((r, i) =>
            i === idx ? { ...r, [field]: value } : r
        );
        setResources(newItems);
        // autosave without success toast to avoid spamming when typing
        // Solo ejecutar si los datos ya se cargaron
        if (isLoaded) {
            setDoc(doc(db, "resources", "main"), {
                RESOURCES: newItems,
                GALLERY_TITLE: galleryTitle,
                GALLERY_NOTE: galleryNote,
            }).catch((e) =>
                toast.error("Error guardando galería: " + String(e))
            );
        }
    }

    async function saveSection() {
        try {
            await setDoc(doc(db, "resources", "main"), {
                RESOURCES: resources,
                GALLERY_TITLE: galleryTitle,
                GALLERY_NOTE: galleryNote,
            });
            toast.success("Galería guardada");
        } catch (err: any) {
            toast.error(
                "Error guardando galería: " + (err.message || String(err))
            );
        }
    }

    function restoreDefaults() {
        setResources(DEFAULT_CONTENT.RESOURCES);
        setGalleryTitle(DEFAULT_CONTENT.GALLERY_CONTENT.title);
        setGalleryNote(DEFAULT_CONTENT.GALLERY_CONTENT.note);
        toast("Galería restaurada a defaults (aún no guardada)");
    }

    // Autosave handlers with debounce
    const autosaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    function handleGalleryTitleChange(value: string) {
        setGalleryTitle(value);
        if (!isLoaded) return;
        if (autosaveTimeoutRef.current) {
            clearTimeout(autosaveTimeoutRef.current);
        }
        autosaveTimeoutRef.current = setTimeout(() => {
            setDoc(doc(db, "resources", "main"), {
                RESOURCES: resources,
                GALLERY_TITLE: value,
                GALLERY_NOTE: galleryNote,
            }).catch((e) =>
                toast.error("Error guardando título: " + String(e))
            );
        }, 400);
    }

    function handleGalleryNoteChange(value: string) {
        setGalleryNote(value);
        if (!isLoaded) return;
        if (autosaveTimeoutRef.current) {
            clearTimeout(autosaveTimeoutRef.current);
        }
        autosaveTimeoutRef.current = setTimeout(() => {
            setDoc(doc(db, "resources", "main"), {
                RESOURCES: resources,
                GALLERY_TITLE: galleryTitle,
                GALLERY_NOTE: value,
            }).catch((e) => toast.error("Error guardando nota: " + String(e)));
        }, 400);
    }

    return (
        <section className="mb-6 p-4 border rounded bg-background/50">
            <h2 className="font-semibold mb-3">Galería</h2>

            {/* Título y Nota de la Galería */}
            <div className="mb-6 p-4 border rounded bg-background/30">
                <h3 className="text-sm font-medium mb-3 text-foreground">
                    Encabezado de Galería
                </h3>
                <div className="space-y-3">
                    <div>
                        <label className="block text-xs font-medium mb-1 text-foreground/80">
                            Título de la sección
                        </label>
                        <input
                            type="text"
                            value={galleryTitle}
                            onChange={(e) =>
                                handleGalleryTitleChange(e.target.value)
                            }
                            className="w-full px-3 py-2 border rounded bg-background/50 text-foreground"
                            placeholder="Ej: Fotos reales y mini videos"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium mb-1 text-foreground/80">
                            Nota debajo del título
                        </label>
                        <textarea
                            value={galleryNote}
                            onChange={(e) =>
                                handleGalleryNoteChange(e.target.value)
                            }
                            rows={2}
                            className="w-full px-3 py-2 border rounded bg-background/50 text-foreground"
                            placeholder="Ej: Énfasis en contenido real y sin filtros..."
                        />
                    </div>
                </div>
            </div>

            {/* Lista de Recursos */}
            <p className="text-sm text-foreground/70 mb-4">
                <strong>💡 Guía rápida:</strong> Título (obligatorio), Subtítulo
                (opcional), Nota (debajo imagen), Características (formato
                "clave: valor")
            </p>
            <div className="flex items-center gap-3 mb-3">
                <button
                    onClick={addEmptyResource}
                    className="px-3 py-2 bg-primary text-background rounded hover:scale-105 transition-transform"
                >
                    Añadir recurso
                </button>
            </div>
            <div className="mt-3 grid gap-3">
                {resources.map((r, idx) => (
                    <div
                        key={r.id}
                        className="flex gap-3 items-start border p-2 rounded"
                    >
                        <div className="w-24 h-16 bg-background/50 rounded overflow-hidden flex items-center justify-center">
                            {r.type === "image" && r.src ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={r.src}
                                    alt={r.title || ""}
                                    className="object-cover w-full h-full"
                                />
                            ) : r.type === "video" && r.src ? (
                                <video
                                    src={r.src}
                                    className="w-full h-full object-cover"
                                    muted
                                />
                            ) : (
                                <div className="text-xs text-foreground/60">
                                    Sin archivo
                                </div>
                            )}
                        </div>
                        <div className="flex-1">
                            {/* Título */}
                            <div className="mb-1">
                                <label className="text-xs text-foreground/60">
                                    Título
                                </label>
                                <input
                                    value={r.title}
                                    onChange={(e) =>
                                        updateResource(
                                            idx,
                                            "title",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Ej: Sala VIP"
                                    className="w-full p-1 rounded border"
                                />
                            </div>

                            {/* Subtítulo */}
                            <div className="mb-1">
                                <label className="text-xs text-foreground/60">
                                    Subtítulo
                                </label>
                                <input
                                    value={r.subtitle}
                                    onChange={(e) =>
                                        updateResource(
                                            idx,
                                            "subtitle",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Descripción corta"
                                    className="w-full p-1 rounded border"
                                />
                            </div>

                            {/* Nota */}
                            <div className="mb-1">
                                <label className="text-xs text-foreground/60">
                                    Nota
                                </label>
                                <input
                                    value={r.note ?? ""}
                                    onChange={(e) =>
                                        updateResource(
                                            idx,
                                            "note",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Ej: Disponible 24/7"
                                    className="w-full p-1 rounded border"
                                />
                            </div>

                            {/* Metadata (características) */}
                            <div className="mb-1">
                                <label className="text-xs text-foreground/60">
                                    Características (clave: valor)
                                </label>
                                <textarea
                                    value={
                                        r.metadata
                                            ? Object.entries(r.metadata)
                                                  .map(([k, v]) => `${k}: ${v}`)
                                                  .join("\n")
                                            : ""
                                    }
                                    onChange={(e) => {
                                        const lines =
                                            e.target.value.split("\n");
                                        const metadata: Record<string, any> =
                                            {};
                                        lines.forEach((line) => {
                                            const [key, ...valueParts] =
                                                line.split(":");
                                            if (key && valueParts.length > 0) {
                                                metadata[key.trim()] =
                                                    valueParts.join(":").trim();
                                            }
                                        });
                                        updateResource(
                                            idx,
                                            "metadata",
                                            Object.keys(metadata).length > 0
                                                ? metadata
                                                : undefined
                                        );
                                    }}
                                    placeholder="Capacidad: 2&#10;Área: 25m²"
                                    rows={3}
                                    className="w-full p-1 rounded border text-sm"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-2 mt-2">
                                <label className="px-2 py-1 border rounded cursor-pointer text-sm inline-flex items-center justify-center">
                                    <span>Subir archivo</span>
                                    <input
                                        type="file"
                                        accept="image/*,video/*"
                                        onChange={(e) => {
                                            const f = e.target.files?.[0];
                                            if (f) {
                                                const uploadingToastId =
                                                    toast.loading(
                                                        "Subiendo archivo..."
                                                    );
                                                (async () => {
                                                    try {
                                                        const type =
                                                            f.type.startsWith(
                                                                "video"
                                                            )
                                                                ? "video"
                                                                : "image";
                                                        let url = "";
                                                        if (type === "image")
                                                            url =
                                                                await uploadImageFile(
                                                                    f,
                                                                    "gallery"
                                                                );
                                                        else
                                                            url =
                                                                await uploadVideoFile(
                                                                    f,
                                                                    "gallery"
                                                                );
                                                        const newItems =
                                                            resources.map(
                                                                (it, i) =>
                                                                    i === idx
                                                                        ? {
                                                                              ...it,
                                                                              src: url,
                                                                              type,
                                                                              title: f.name,
                                                                          }
                                                                        : it
                                                            );
                                                        setResources(newItems);
                                                        await setDoc(
                                                            doc(
                                                                db,
                                                                "resources",
                                                                "main"
                                                            ),
                                                            {
                                                                RESOURCES:
                                                                    newItems,
                                                            }
                                                        );
                                                        toast.dismiss(
                                                            uploadingToastId
                                                        );
                                                        toast.success(
                                                            "Archivo subido y recurso actualizado"
                                                        );
                                                    } catch (err: any) {
                                                        toast.dismiss(
                                                            uploadingToastId
                                                        );
                                                        toast.error(
                                                            "Error subiendo archivo: " +
                                                                (err?.message ||
                                                                    String(err))
                                                        );
                                                    }
                                                })();
                                            }
                                            (
                                                e.target as HTMLInputElement
                                            ).value = "";
                                        }}
                                        className="hidden"
                                    />
                                </label>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => toggleActive(idx)}
                                        className={`px-2 py-1 border rounded text-sm font-bold text-white ${
                                            r.active === false
                                                ? "bg-emerald-600"
                                                : "bg-rose-600"
                                        }`}
                                    >
                                        {r.active === false
                                            ? "Activar"
                                            : "Desactivar"}
                                    </button>
                                    <button
                                        onClick={() =>
                                            updateResource(
                                                idx,
                                                "order",
                                                (r.order ?? idx) - 1
                                            )
                                        }
                                        className="px-2 py-1 border rounded text-sm"
                                    >
                                        ↑
                                    </button>
                                    <button
                                        onClick={() =>
                                            updateResource(
                                                idx,
                                                "order",
                                                (r.order ?? idx) + 1
                                            )
                                        }
                                        className="px-2 py-1 border rounded text-sm"
                                    >
                                        ↓
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex gap-2 mt-3">
                <button
                    onClick={saveSection}
                    className="px-3 py-2 bg-primary text-background rounded hover:scale-105 transition-transform active:scale-95 duration-1000"
                >
                    Guardar sección
                </button>
                <button
                    onClick={restoreDefaults}
                    className="px-3 py-2 border rounded"
                >
                    Restaurar defaults
                </button>
            </div>
            {/* feedback via react-hot-toast */}
        </section>
    );
}

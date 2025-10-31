"use client";
import { useEffect, useState } from "react";
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
};

export default function GalleryTab() {
    const [resources, setResources] = useState<Resource[]>(
        DEFAULT_CONTENT.RESOURCES
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
                setIsLoaded(true);
            } catch (err) {
                setResources(DEFAULT_CONTENT.RESOURCES);
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
            await setDoc(doc(db, "resources", "main"), { RESOURCES: newItems });
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
            await setDoc(doc(db, "resources", "main"), { RESOURCES: newItems });
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
        setDoc(doc(db, "resources", "main"), { RESOURCES: newItems }).catch(
            (e) => toast.error("Error guardando galería: " + String(e))
        );
    }

    function updateResource(idx: number, field: string, value: any) {
        const newItems = resources.map((r, i) =>
            i === idx ? { ...r, [field]: value } : r
        );
        setResources(newItems);
        // autosave without success toast to avoid spamming when typing
        // Solo ejecutar si los datos ya se cargaron
        if (isLoaded) {
            setDoc(doc(db, "resources", "main"), { RESOURCES: newItems }).catch(
                (e) => toast.error("Error guardando galería: " + String(e))
            );
        }
    }

    async function saveSection() {
        try {
            await setDoc(doc(db, "resources", "main"), {
                RESOURCES: resources,
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
        toast("Galería restaurada a defaults (aún no guardada)");
    }

    return (
        <section className="mb-6 p-4 border rounded bg-background/50">
            <h2 className="font-semibold mb-3">Galería</h2>
            <p className="text-sm text-foreground/70 mb-2">
                Sube imágenes o videos. Puedes subir varios archivos a la vez o
                añadir recursos vacíos y subir un archivo por recurso.
            </p>
            <div className="flex items-center gap-3 mb-3">
                {/* <input
                    type="file"
                    accept="image/*,video/*"
                    multiple
                    onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        files.forEach((f) => addResourceFromFile(f));
                        (e.target as HTMLInputElement).value = "";
                    }}
                /> */}
                <button
                    onClick={addEmptyResource}
                    className="px-3 py-2 bg-primary text-white rounded"
                >
                    Añadir recurso
                </button>
            </div>
            <div className="mt-3 grid gap-3">
                {resources.map((r, idx) => (
                    <div
                        key={r.id}
                        className="flex gap-3 items-center border p-2 rounded"
                    >
                        <div className="w-24 h-16 bg-gray-200 rounded overflow-hidden flex items-center justify-center">
                            {r.type === "image" && r.src ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={r.src}
                                    alt={r.title || ""}
                                    className="object-cover w-full h-full min-h-24"
                                />
                            ) : r.type === "video" && r.src ? (
                                <video
                                    src={r.src}
                                    className="w-full h-full object-cover "
                                    muted
                                />
                            ) : (
                                <div className="text-sm text-foreground/60">
                                    Sin archivo
                                </div>
                            )}
                        </div>
                        <div className="flex-1">
                            <input
                                value={r.title}
                                onChange={(e) =>
                                    updateResource(idx, "title", e.target.value)
                                }
                                className="w-full p-1 rounded border mb-1"
                            />
                            <input
                                value={r.subtitle}
                                onChange={(e) =>
                                    updateResource(
                                        idx,
                                        "subtitle",
                                        e.target.value
                                    )
                                }
                                className="w-full p-1 rounded border mb-1"
                            />
                            <div className="grid grid-cols-2 gap-2 mt-2">
                                <label className="px-2 py-1 border rounded cursor-pointer text-sm inline-flex items-center justify-between">
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
                            <div className="mt-2 grid gap-2">
                                <input
                                    value={r.alt ?? ""}
                                    onChange={(e) =>
                                        updateResource(
                                            idx,
                                            "alt",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Alt text"
                                    className="w-full p-1 rounded border"
                                />
                                <input
                                    value={r.caption ?? ""}
                                    onChange={(e) =>
                                        updateResource(
                                            idx,
                                            "caption",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Caption"
                                    className="w-full p-1 rounded border"
                                />
                                <input
                                    value={r.href ?? ""}
                                    onChange={(e) =>
                                        updateResource(
                                            idx,
                                            "href",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Link (href) opcional"
                                    className="w-full p-1 rounded border"
                                />
                                <input
                                    value={r.note ?? ""}
                                    onChange={(e) =>
                                        updateResource(
                                            idx,
                                            "note",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Nota interna"
                                    className="w-full p-1 rounded border"
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex gap-2 mt-3">
                <button
                    onClick={saveSection}
                    className="px-3 py-2 bg-primary text-white rounded cursor-pointer hover:scale-105 transition-all duration-500"
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

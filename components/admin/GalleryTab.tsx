"use client";
import { useEffect, useState } from "react";
import { DEFAULT_CONTENT } from "../../lib/content";

export default function GalleryTab() {
    const [resources, setResources] = useState<any[]>([
        ...DEFAULT_CONTENT.RESOURCES,
    ]);
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;
        async function load() {
            try {
                const res = await fetch("/api/content");
                if (!res.ok) throw new Error("no content api");
                const json = await res.json();
                if (!mounted) return;
                setResources(json.RESOURCES ?? DEFAULT_CONTENT.RESOURCES);
            } catch (err) {
                setResources(DEFAULT_CONTENT.RESOURCES);
            }
        }
        load();
        return () => {
            mounted = false;
        };
    }, []);

    function addResourceFromFile(file: File) {
        const reader = new FileReader();
        reader.onload = () => {
            const result = reader.result as string;
            const id = `r${Date.now()}`;
            const type = file.type.startsWith("video") ? "video" : "image";
            setResources((s) => [
                ...s,
                {
                    id,
                    type,
                    src: result,
                    title: file.name,
                    subtitle: "",
                    note: "",
                },
            ]);
        };
        reader.readAsDataURL(file);
    }

    function removeResource(idx: number) {
        setResources((s) => s.filter((_, i) => i !== idx));
    }

    function updateResource(idx: number, field: string, value: any) {
        setResources((s) =>
            s.map((r, i) => (i === idx ? { ...r, [field]: value } : r))
        );
    }

    async function saveSection() {
        try {
            const res = await fetch("/api/content", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ RESOURCES: resources }),
            });
            if (!res.ok) throw new Error("save failed");
            setMessage("Galería guardada");
        } catch (err: any) {
            setMessage(
                "Error guardando galería: " + (err.message || String(err))
            );
        }
    }

    function restoreDefaults() {
        setResources(DEFAULT_CONTENT.RESOURCES);
        setMessage("Galería restaurada a defaults (aún no guardada)");
    }

    return (
        <section className="mb-6 p-4 border rounded bg-background/50">
            <h2 className="font-semibold mb-3">Galería</h2>
            <p className="text-sm text-foreground/70 mb-2">
                Sube imágenes o videos. Se almacenan como data URLs en memoria y
                se incluyen al guardar en servidor.
            </p>
            <input
                type="file"
                accept="image/*,video/*"
                onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) addResourceFromFile(f);
                    (e.target as HTMLInputElement).value = "";
                }}
            />
            <div className="mt-3 grid gap-3">
                {resources.map((r, idx) => (
                    <div
                        key={r.id}
                        className="flex gap-3 items-center border p-2 rounded"
                    >
                        <div className="w-24 h-16 bg-gray-200 rounded overflow-hidden flex items-center justify-center">
                            {r.type === "image" ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={r.src}
                                    alt={r.title || ""}
                                    className="object-cover w-full h-full"
                                />
                            ) : (
                                <video
                                    src={r.src}
                                    className="w-full h-full object-cover"
                                    muted
                                />
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
                            <div className="flex gap-2">
                                <button
                                    onClick={() => removeResource(idx)}
                                    className="px-2 py-1 border rounded"
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex gap-2 mt-3">
                <button
                    onClick={saveSection}
                    className="px-3 py-2 bg-secondary text-background rounded"
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
            {message && <p className="mt-2 text-sm">{message}</p>}
        </section>
    );
}

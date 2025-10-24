"use client";
import { useEffect, useState } from "react";
import DEFAULT_CONTENT from "../../lib/content";
import { db } from "@/services/firebase/client";
import { doc, getDoc, setDoc } from "firebase/firestore";

function makeId(name = "") {
    return (
        name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "") || String(Date.now())
    );
}

export default function TestimonialsTab() {
    const [items, setItems] = useState<any[]>([
        ...(DEFAULT_CONTENT.TESTIMONIALS || []),
    ]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;
        async function load() {
            try {
                const snap = await getDoc(doc(db, "testimonials", "main"));
                const data = snap.exists() ? (snap.data() as any) : null;
                if (!mounted) return;
                setItems(data?.TESTIMONIALS ?? DEFAULT_CONTENT.TESTIMONIALS);
            } catch (err) {
                setItems(DEFAULT_CONTENT.TESTIMONIALS);
            } finally {
                if (mounted) setLoading(false);
            }
        }
        load();
        return () => {
            mounted = false;
        };
    }, []);

    function updateItem(idx: number, key: string, value: any) {
        const copy = [...items];
        copy[idx] = { ...copy[idx], [key]: value };
        setItems(copy);
    }

    function addItem() {
        const id = makeId("t" + items.length);
        setItems([
            ...items,
            { id, name: "Nuevo", age: 30, text: "", rating: 5 },
        ]);
    }

    function removeItem(idx: number) {
        setItems(items.filter((_, i) => i !== idx));
    }

    async function saveSection() {
        try {
            await setDoc(doc(db, "testimonials", "main"), {
                TESTIMONIALS: items,
            });
            setMessage("Testimonials guardados");
        } catch (err: any) {
            setMessage(
                "Error guardando testimonials: " + (err.message || String(err))
            );
        }
    }

    function restoreDefaults() {
        setItems(DEFAULT_CONTENT.TESTIMONIALS);
        setMessage("Testimonials restaurados a defaults (aún no guardado)");
    }

    if (loading) return <div className="p-4">Cargando testimonials...</div>;

    return (
        <section className="mb-6 p-4 border rounded bg-background/50">
            <h2 className="font-semibold mb-3">Testimonios</h2>

            <div className="space-y-4">
                {items.map((p, idx) => (
                    <div key={p.id || idx} className="p-3 border rounded">
                        <label className="block text-sm">ID</label>
                        <input
                            value={p.id}
                            onChange={(e) =>
                                updateItem(idx, "id", e.target.value)
                            }
                            className="w-full p-2 rounded border mb-2"
                        />

                        <label className="block text-sm">Nombre</label>
                        <input
                            value={p.name || ""}
                            onChange={(e) =>
                                updateItem(idx, "name", e.target.value)
                            }
                            className="w-full p-2 rounded border mb-2"
                        />

                        <label className="block text-sm">Edad</label>
                        <input
                            type="number"
                            value={p.age ?? ""}
                            onChange={(e) =>
                                updateItem(idx, "age", Number(e.target.value))
                            }
                            className="w-full p-2 rounded border mb-2"
                        />

                        <label className="block text-sm">Texto</label>
                        <textarea
                            value={p.text || ""}
                            onChange={(e) =>
                                updateItem(idx, "text", e.target.value)
                            }
                            rows={2}
                            className="w-full p-2 rounded border mb-2"
                        />

                        <label className="block text-sm">Rating (1-5)</label>
                        <input
                            type="number"
                            min={1}
                            max={5}
                            value={p.rating ?? 5}
                            onChange={(e) =>
                                updateItem(
                                    idx,
                                    "rating",
                                    Number(e.target.value)
                                )
                            }
                            className="w-full p-2 rounded border mb-2"
                        />

                        <div className="flex gap-2">
                            <button
                                onClick={() => removeItem(idx)}
                                className="px-3 py-2 border rounded"
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex gap-2 mt-4">
                <button onClick={addItem} className="px-3 py-2 border rounded">
                    Añadir testimonio
                </button>
                <button
                    onClick={saveSection}
                    className="px-3 py-2 bg-primary text-background rounded"
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

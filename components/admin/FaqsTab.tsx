"use client";
import { useEffect, useState } from "react";
import { DEFAULT_CONTENT } from "../../lib/content";
import { db } from "@/services/firebase/client";
import { doc, getDoc, setDoc } from "firebase/firestore";
import toast from "react-hot-toast";

export default function FaqsTab() {
    const [faqs, setFaqs] = useState<any[]>([...DEFAULT_CONTENT.FAQS]);
    const [loading, setLoading] = useState(true);
    const [showInactive, setShowInactive] = useState(false);

    useEffect(() => {
        let mounted = true;
        async function load() {
            try {
                // read from collection 'faq1' (doc 'main')
                const snap = await getDoc(doc(db, "faq1", "main"));
                const data = snap.exists() ? (snap.data() as any) : null;
                if (!mounted) return;
                setFaqs(data?.FAQS ?? DEFAULT_CONTENT.FAQS);
            } catch (err) {
                setFaqs(DEFAULT_CONTENT.FAQS);
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
        const copy = [...faqs];
        copy[idx] = { ...copy[idx], [key]: value };
        setFaqs(copy);
    }

    function addItem() {
        setFaqs([
            ...faqs,
            { q: "Nueva pregunta", a: "Respuesta...", active: true },
        ]);
    }

    function removeItem(idx: number) {
        const newItems = faqs.filter((_, i) => i !== idx);
        setFaqs(newItems);
    }

    function toggleActive(idx: number) {
        const copy = [...faqs];
        copy[idx] = {
            ...copy[idx],
            active: copy[idx].active === false ? true : false,
        };
        setFaqs(copy);
        // persist silently
        setDoc(doc(db, "faq1", "main"), { FAQS: copy }).catch((e) =>
            toast.error("Error actualizando FAQ: " + String(e))
        );
    }

    async function saveSection() {
        try {
            // write payload { FAQS: [...] } into collection 'faq1'
            await setDoc(doc(db, "faq1", "main"), { FAQS: faqs });
            toast.success("FAQS guardadas");
        } catch (err: any) {
            toast.error(
                "Error guardando faqs: " + (err.message || String(err))
            );
        }
    }

    function restoreDefaults() {
        setFaqs(DEFAULT_CONTENT.FAQS);
        toast("FAQs restauradas a defaults (aún no guardado)");
    }

    if (loading) return <div className="p-4">Cargando FAQs...</div>;

    const inactiveCount = faqs.filter((f) => f.active === false).length;
    const visible = faqs
        .map((f, i) => ({ ...f, _idx: i }))
        .filter((f) => (showInactive ? true : f.active !== false));

    return (
        <section className="mb-6 p-4 border rounded bg-background/50">
            <h2 className="font-semibold mb-3">Preguntas frecuentes</h2>

            <div className="mb-3">
                <button
                    onClick={() => setShowInactive((s) => !s)}
                    className="px-3 py-2 border rounded text-sm"
                >
                    {showInactive
                        ? `Ocultar inactivos (${inactiveCount})`
                        : `Mostrar inactivos (${inactiveCount})`}
                </button>
            </div>

            <div className="space-y-4">
                {visible.map((f: any) => {
                    const idx = f._idx;
                    return (
                        <div
                            key={f.id || idx}
                            className={`p-3 border rounded ${
                                f.active === false ? "opacity-50 grayscale" : ""
                            }`}
                        >
                            <label className="block text-sm">
                                Pregunta (q)
                            </label>
                            <input
                                value={f.q}
                                onChange={(e) =>
                                    updateItem(idx, "q", e.target.value)
                                }
                                className="w-full p-2 rounded border mb-2"
                            />

                            <label className="block text-sm">
                                Respuesta (a)
                            </label>
                            <textarea
                                value={f.a}
                                onChange={(e) =>
                                    updateItem(idx, "a", e.target.value)
                                }
                                rows={3}
                                className="w-full p-2 rounded border mb-2"
                            />

                            <div className="flex gap-2">
                                <button
                                    onClick={() => removeItem(idx)}
                                    className="px-3 py-2 border rounded"
                                >
                                    Eliminar
                                </button>
                                <button
                                    onClick={() => toggleActive(idx)}
                                    className="px-3 py-2 border rounded"
                                >
                                    {f.active === false
                                        ? "Activar"
                                        : "Desactivar"}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="flex gap-2 mt-4">
                <button onClick={addItem} className="px-3 py-2 border rounded">
                    Añadir pregunta
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

            {/* feedback via react-hot-toast */}
        </section>
    );
}

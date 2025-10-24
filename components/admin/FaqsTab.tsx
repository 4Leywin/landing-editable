"use client";
import { useEffect, useState } from "react";
import { DEFAULT_CONTENT } from "../../lib/content";
import { db } from "@/services/firebase/client";
import { doc, getDoc, setDoc } from "firebase/firestore";
import toast from "react-hot-toast";

export default function FaqsTab() {
    const [faqs, setFaqs] = useState<any[]>([...DEFAULT_CONTENT.FAQS]);
    const [loading, setLoading] = useState(true);

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
        setFaqs([...faqs, { q: "Nueva pregunta", a: "Respuesta..." }]);
    }

    function removeItem(idx: number) {
        setFaqs(faqs.filter((_, i) => i !== idx));
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

    return (
        <section className="mb-6 p-4 border rounded bg-background/50">
            <h2 className="font-semibold mb-3">Preguntas frecuentes</h2>

            <div className="space-y-4">
                {faqs.map((f: any, idx: number) => (
                    <div key={idx} className="p-3 border rounded">
                        <label className="block text-sm">Pregunta (q)</label>
                        <input
                            value={f.q}
                            onChange={(e) =>
                                updateItem(idx, "q", e.target.value)
                            }
                            className="w-full p-2 rounded border mb-2"
                        />

                        <label className="block text-sm">Respuesta (a)</label>
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
                        </div>
                    </div>
                ))}
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

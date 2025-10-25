"use client";
import { useEffect, useState } from "react";
import DEFAULT_CONTENT from "../../lib/content";
import { db } from "@/services/firebase/client";
import { doc, getDoc, setDoc } from "firebase/firestore";
import toast from "react-hot-toast";

export default function CtasTab() {
    const [ctas, setCtas] = useState<any[]>([...(DEFAULT_CONTENT.CTAS || [])]);
    const [footer, setFooter] = useState<string>(
        DEFAULT_CONTENT.FOOTER_NOTE || ""
    );
    const [loading, setLoading] = useState(true);
    const [showInactive, setShowInactive] = useState(false);

    useEffect(() => {
        let mounted = true;
        async function load() {
            try {
                const snap = await getDoc(doc(db, "ctas", "main"));
                const data = snap.exists() ? (snap.data() as any) : null;
                if (!mounted) return;
                setCtas(data?.CTAS ?? DEFAULT_CONTENT.CTAS);

                const fSnap = await getDoc(doc(db, "footer_note", "main"));
                const fData = fSnap.exists() ? (fSnap.data() as any) : null;
                if (!mounted) return;
                setFooter(fData?.FOOTER_NOTE ?? DEFAULT_CONTENT.FOOTER_NOTE);
            } catch (err) {
                setCtas(DEFAULT_CONTENT.CTAS);
                setFooter(DEFAULT_CONTENT.FOOTER_NOTE);
            } finally {
                if (mounted) setLoading(false);
            }
        }
        load();
        return () => {
            mounted = false;
        };
    }, []);

    function updateCta(idx: number, key: string, value: any) {
        const copy = [...ctas];
        copy[idx] = { ...copy[idx], [key]: value };
        setCtas(copy);
    }

    function addCta() {
        setCtas([...ctas, { label: "Nuevo CTA", url: "#", active: true }]);
    }

    function removeCta(idx: number) {
        const newItems = ctas.filter((_, i) => i !== idx);
        setCtas(newItems);
    }

    function toggleActive(idx: number) {
        const copy = [...ctas];
        copy[idx] = {
            ...copy[idx],
            active: copy[idx].active === false ? true : false,
        };
        setCtas(copy);
        setDoc(doc(db, "ctas", "main"), { CTAS: copy }).catch((e) =>
            toast.error("Error actualizando CTA: " + String(e))
        );
    }

    async function saveSection() {
        try {
            await setDoc(doc(db, "ctas", "main"), { CTAS: ctas });
            await setDoc(doc(db, "footer_note", "main"), {
                FOOTER_NOTE: footer,
            });
            toast.success("CTA y Footer guardados");
        } catch (err: any) {
            toast.error(
                "Error guardando CTA/Footer: " + (err.message || String(err))
            );
        }
    }

    function restoreDefaults() {
        setCtas(DEFAULT_CONTENT.CTAS);
        setFooter(DEFAULT_CONTENT.FOOTER_NOTE);
        toast("CTA y Footer restaurados a defaults (aún no guardado)");
    }

    if (loading) return <div className="p-4">Cargando CTA...</div>;

    const inactiveCount = ctas.filter((c) => c.active === false).length;
    const visible = ctas
        .map((c, i) => ({ ...c, _idx: i }))
        .filter((c) => (showInactive ? true : c.active !== false));

    return (
        <section className="mb-6 p-4 border rounded bg-background/50">
            <h2 className="font-semibold mb-3">CTA — Botones y Footer</h2>

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
                {visible.map((c: any) => {
                    const idx = c._idx;
                    return (
                        <div
                            key={c.id || idx}
                            className={`p-3 border rounded ${
                                c.active === false ? "opacity-50 grayscale" : ""
                            }`}
                        >
                            <label className="block text-sm">Etiqueta</label>
                            <input
                                value={c.label}
                                onChange={(e) =>
                                    updateCta(idx, "label", e.target.value)
                                }
                                className="w-full p-2 rounded border mb-2"
                            />
                            <label className="block text-sm">URL</label>
                            <input
                                value={c.url}
                                onChange={(e) =>
                                    updateCta(idx, "url", e.target.value)
                                }
                                className="w-full p-2 rounded border mb-2"
                            />
                            <div className="flex gap-2">
                                <button
                                    onClick={() => removeCta(idx)}
                                    className="px-3 py-2 border rounded"
                                >
                                    Eliminar
                                </button>
                                <button
                                    onClick={() => toggleActive(idx)}
                                    className="px-3 py-2 border rounded"
                                >
                                    {c.active === false
                                        ? "Activar"
                                        : "Desactivar"}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-3">
                <button onClick={addCta} className="px-3 py-2 border rounded">
                    Añadir CTA
                </button>
            </div>

            <div className="mt-6">
                <label className="block text-sm">Texto de footer</label>
                <input
                    value={footer}
                    onChange={(e) => setFooter(e.target.value)}
                    className="w-full p-2 rounded border"
                />
            </div>

            <div className="flex gap-2 mt-4">
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

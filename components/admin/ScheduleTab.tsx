"use client";
import { useEffect, useState } from "react";
import DEFAULT_CONTENT from "../../lib/content";
import { db } from "@/services/firebase/client";
import { doc, getDoc, setDoc } from "firebase/firestore";
import toast from "react-hot-toast";

function makeId(name = "") {
    return (
        name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "") || String(Date.now())
    );
}

export default function ScheduleTab() {
    const [items, setItems] = useState<any[]>([
        ...(DEFAULT_CONTENT.SCHEDULE || []),
    ]);
    const [loading, setLoading] = useState(true);
    const [showInactive, setShowInactive] = useState(false);

    useEffect(() => {
        let mounted = true;
        async function load() {
            try {
                const snap = await getDoc(doc(db, "schedule", "main"));
                const data = snap.exists() ? (snap.data() as any) : null;
                if (!mounted) return;
                setItems(data?.SCHEDULE ?? DEFAULT_CONTENT.SCHEDULE);
            } catch (err) {
                setItems(DEFAULT_CONTENT.SCHEDULE);
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
        const id = makeId("s" + items.length);
        setItems([
            ...items,
            { id, days: "Nuevo", hours: "", note: "", active: true },
        ]);
    }

    function removeItem(idx: number) {
        setItems(items.filter((_, i) => i !== idx));
    }

    function toggleActive(idx: number) {
        const copy = [...items];
        copy[idx] = {
            ...copy[idx],
            active: copy[idx].active === false ? true : false,
        };
        setItems(copy);
    }

    async function saveSection() {
        try {
            await setDoc(doc(db, "schedule", "main"), {
                SCHEDULE: items,
            });
            toast.success("Horario guardado");
        } catch (err: any) {
            toast.error(
                "Error guardando horario: " + (err.message || String(err))
            );
        }
    }

    function restoreDefaults() {
        setItems(DEFAULT_CONTENT.SCHEDULE);
        toast("Horario restaurado a defaults (aún no guardado)");
    }

    if (loading) return <div className="p-4">Cargando horario...</div>;
    const inactiveCount = (items || []).filter(
        (it) => it && it.active === false
    ).length;
    const visibleItems = (items || [])
        .map((it, i) => ({ ...(it || {}), _idx: i }))
        .filter((it) => (showInactive ? true : it.active !== false));

    return (
        <section className="mb-6 p-4 border rounded bg-background/50">
            <h2 className="font-semibold mb-3">Horario / Schedule</h2>
            <div className="flex gap-2 mb-3">
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
                {visibleItems.map((p: any) => {
                    const idx = p._idx;
                    return (
                        <div key={p.id || idx} className="p-3 border rounded">
                            <label className="block text-sm">ID</label>
                            <input
                                value={p.id}
                                onChange={(e) =>
                                    updateItem(idx, "id", e.target.value)
                                }
                                className="w-full p-2 rounded border mb-2"
                            />

                            <label className="block text-sm">Días (days)</label>
                            <input
                                value={p.days || ""}
                                onChange={(e) =>
                                    updateItem(idx, "days", e.target.value)
                                }
                                className="w-full p-2 rounded border mb-2"
                            />

                            <label className="block text-sm">
                                Horas (hours)
                            </label>
                            <input
                                value={p.hours || ""}
                                onChange={(e) =>
                                    updateItem(idx, "hours", e.target.value)
                                }
                                className="w-full p-2 rounded border mb-2"
                            />

                            <label className="block text-sm">Nota (note)</label>
                            <input
                                value={p.note || ""}
                                onChange={(e) =>
                                    updateItem(idx, "note", e.target.value)
                                }
                                className="w-full p-2 rounded border mb-2"
                            />

                            <div className="flex gap-2">
                                <button
                                    onClick={() => toggleActive(idx)}
                                    className={`px-3 py-2 border rounded ${
                                        items[idx]?.active === false
                                            ? "bg-emerald-100"
                                            : ""
                                    }`}
                                >
                                    {items[idx]?.active === false
                                        ? "Activar"
                                        : "Desactivar"}
                                </button>
                                <button
                                    onClick={() => removeItem(idx)}
                                    className="px-3 py-2 border rounded"
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="flex gap-2 mt-4">
                <button onClick={addItem} className="px-3 py-2 border rounded">
                    Añadir fila
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
        </section>
    );
}

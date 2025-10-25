"use client";
import { useEffect, useState } from "react";
import { DEFAULT_CONTENT } from "../../lib/content";
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

export default function PricesTab() {
    const [prices, setPrices] = useState<any[]>([...DEFAULT_CONTENT.PRICES]);
    const [loading, setLoading] = useState(true);
    const [showInactive, setShowInactive] = useState(false);

    useEffect(() => {
        let mounted = true;
        async function load() {
            try {
                const snap = await getDoc(doc(db, "prices", "main"));
                const data = snap.exists() ? (snap.data() as any) : null;
                console.log("Loaded PRICES data:", data);
                if (!mounted) return;
                setPrices(data?.PRICES ?? DEFAULT_CONTENT.PRICES);
            } catch (err) {
                setPrices(DEFAULT_CONTENT.PRICES);
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
        const copy = [...prices];
        copy[idx] = { ...copy[idx], [key]: value };
        setPrices(copy);
    }

    function addItem() {
        const newItem = {
            id: makeId("item" + prices.length),
            name: "Nuevo servicio",
            price: "S/0",
            duration: "",
            description: "",
            features: [],
            active: true,
        };
        setPrices([...prices, newItem]);
    }

    function removeItem(idx: number) {
        const copy = prices.filter((_, i) => i !== idx);
        setPrices(copy);
    }

    function toggleActive(idx: number) {
        const copy = prices.map((p, i) =>
            i === idx ? { ...p, active: p.active === false ? true : false } : p
        );
        setPrices(copy);
    }

    async function saveSection() {
        try {
            await setDoc(doc(db, "prices", "main"), { PRICES: prices });
            toast.success("Prices guardados");
        } catch (err: any) {
            toast.error(
                "Error guardando prices: " + (err.message || String(err))
            );
        }
    }

    function restoreDefaults() {
        setPrices(DEFAULT_CONTENT.PRICES);
        toast("Prices restaurados a defaults (aún no guardado)");
    }

    if (loading) {
        return <div className="p-4">Cargando precios...</div>;
    }

    return (
        <section className="mb-6 p-4 border rounded bg-background/50">
            <h2 className="font-semibold mb-3">Precios</h2>
            <div className="mb-3">
                <button
                    onClick={() => setShowInactive((s) => !s)}
                    className="px-3 py-2 border rounded text-sm"
                >
                    {showInactive
                        ? `Ocultar inactivos (${
                              (prices || []).filter((p) => p.active === false)
                                  .length
                          })`
                        : `Mostrar inactivos (${
                              (prices || []).filter((p) => p.active === false)
                                  .length
                          })`}
                </button>
            </div>
            <div className="space-y-4">
                {(() => {
                    const visible = (prices || [])
                        .map((p, i) => ({ ...(p || {}), _idx: i }))
                        .filter((p) =>
                            showInactive ? true : p.active !== false
                        );
                    return visible.map((p) => {
                        const idx = p._idx;
                        return (
                            <div
                                key={p.id || idx}
                                className={`p-3 border rounded ${
                                    p.active === false
                                        ? "opacity-50 grayscale"
                                        : ""
                                }`}
                            >
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
                                    value={p.name}
                                    onChange={(e) =>
                                        updateItem(idx, "name", e.target.value)
                                    }
                                    className="w-full p-2 rounded border mb-2"
                                />

                                <label className="block text-sm">Precio</label>
                                <input
                                    value={p.price}
                                    onChange={(e) =>
                                        updateItem(idx, "price", e.target.value)
                                    }
                                    className="w-full p-2 rounded border mb-2"
                                />

                                <label className="block text-sm">
                                    Duración
                                </label>
                                <input
                                    value={p.duration}
                                    onChange={(e) =>
                                        updateItem(
                                            idx,
                                            "duration",
                                            e.target.value
                                        )
                                    }
                                    className="w-full p-2 rounded border mb-2"
                                />

                                <label className="block text-sm">
                                    Descripción
                                </label>
                                <textarea
                                    value={p.description}
                                    onChange={(e) =>
                                        updateItem(
                                            idx,
                                            "description",
                                            e.target.value
                                        )
                                    }
                                    rows={2}
                                    className="w-full p-2 rounded border mb-2"
                                />

                                <label className="block text-sm">
                                    Características (coma-sep)
                                </label>
                                <input
                                    value={(p.features || []).join(", ")}
                                    onChange={(e) =>
                                        updateItem(
                                            idx,
                                            "features",
                                            e.target.value
                                                .split(",")
                                                .map((s) => s.trim())
                                                .filter(Boolean)
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
                        );
                    });
                })()}
            </div>

            <div className="flex gap-2 mt-4">
                <button onClick={addItem} className="px-3 py-2 border rounded">
                    Añadir item
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

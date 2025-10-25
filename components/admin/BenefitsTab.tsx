"use client";
import { useEffect, useState } from "react";
import { DEFAULT_CONTENT } from "../../lib/content";
import { db } from "@/services/firebase/client";
import { doc, getDoc, setDoc } from "firebase/firestore";
import toast from "react-hot-toast";

export default function BenefitsTab() {
    const [benefits, setBenefits] = useState<any[]>([
        ...DEFAULT_CONTENT.BENEFITS,
    ]);
    const [showInactive, setShowInactive] = useState(false);

    useEffect(() => {
        let mounted = true;
        async function load() {
            try {
                const snap = await getDoc(doc(db, "benefits", "main"));
                const data = snap.exists() ? (snap.data() as any) : null;
                if (!mounted) return;
                setBenefits(data?.BENEFITS ?? DEFAULT_CONTENT.BENEFITS);
            } catch (err) {
                setBenefits(DEFAULT_CONTENT.BENEFITS);
            }
        }
        load();
        return () => {
            mounted = false;
        };
    }, []);

    function addBenefit() {
        const newItems = [
            ...benefits,
            {
                id: `b${Date.now()}`,
                title: "Nuevo beneficio",
                description: "Descripción",
                active: true,
            },
        ];
        setBenefits(newItems);
        // persist silently on add/remove/update to avoid toast spam; surface errors only
        setDoc(doc(db, "benefits", "main"), { BENEFITS: newItems }).catch((e) =>
            toast.error("Error guardando beneficios: " + String(e))
        );
    }
    function updateBenefit(idx: number, field: string, value: string) {
        const newItems = benefits.map((it, i) =>
            i === idx ? { ...it, [field]: value } : it
        );
        setBenefits(newItems);
        setDoc(doc(db, "benefits", "main"), { BENEFITS: newItems }).catch((e) =>
            toast.error("Error guardando beneficios: " + String(e))
        );
    }
    function removeBenefit(idx: number) {
        const newItems = benefits.filter((_, i) => i !== idx);
        setBenefits(newItems);
        setDoc(doc(db, "benefits", "main"), { BENEFITS: newItems }).catch((e) =>
            toast.error("Error guardando beneficios: " + String(e))
        );
    }

    function toggleActive(idx: number) {
        const copy = [...benefits];
        copy[idx] = {
            ...copy[idx],
            active: copy[idx].active === false ? true : false,
        };
        setBenefits(copy);
        setDoc(doc(db, "benefits", "main"), { BENEFITS: copy }).catch((e) =>
            toast.error("Error actualizando beneficio: " + String(e))
        );
    }

    async function saveSection() {
        try {
            await setDoc(doc(db, "benefits", "main"), { BENEFITS: benefits });
            toast.success("Beneficios guardados");
        } catch (err: any) {
            toast.error(
                "Error guardando beneficios: " + (err.message || String(err))
            );
        }
    }

    function restoreDefaults() {
        setBenefits(DEFAULT_CONTENT.BENEFITS);
        toast("Beneficios restaurados a defaults (aún no guardados)");
    }

    const inactiveCount = benefits.filter((b) => b.active === false).length;
    const visible = benefits
        .map((b, i) => ({ ...b, _idx: i }))
        .filter((b) => (showInactive ? true : b.active !== false));

    return (
        <section className="mb-6 p-4 border rounded bg-background/50">
            <h2 className="font-semibold mb-3">Beneficios</h2>
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

            {visible.map((b: any) => {
                const idx = b._idx;
                return (
                    <div
                        key={b.id || idx}
                        className={`mb-3 border-b pb-2 ${
                            b.active === false ? "opacity-50 grayscale" : ""
                        }`}
                    >
                        <input
                            value={b.title}
                            onChange={(e) =>
                                updateBenefit(idx, "title", e.target.value)
                            }
                            className="w-full p-2 rounded border mb-1"
                        />
                        <textarea
                            value={b.description}
                            onChange={(e) =>
                                updateBenefit(
                                    idx,
                                    "description",
                                    e.target.value
                                )
                            }
                            rows={2}
                            className="w-full p-2 rounded border"
                        />
                        <div className="flex justify-end gap-2 mt-1">
                            <button
                                onClick={() => removeBenefit(idx)}
                                className="px-2 py-1 border rounded"
                            >
                                Eliminar
                            </button>
                            <button
                                onClick={() => toggleActive(idx)}
                                className="px-2 py-1 border rounded"
                            >
                                {b.active === false ? "Activar" : "Desactivar"}
                            </button>
                        </div>
                    </div>
                );
            })}
            <p>
                Siempre se veran al menos 3 beneficios en el sitio, si hay menos
                se completara con los beneficios por defecto.
            </p>
            <div className="flex gap-2 mt-2">
                <button
                    onClick={addBenefit}
                    className="px-3 py-2 bg-primary text-background rounded"
                >
                    Agregar beneficio
                </button>
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

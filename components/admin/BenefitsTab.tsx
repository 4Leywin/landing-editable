"use client";
import { useEffect, useState } from "react";
import { DEFAULT_CONTENT } from "../../lib/content";
import { db } from "@/services/firebase/client";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function BenefitsTab() {
    const [benefits, setBenefits] = useState<any[]>([
        ...DEFAULT_CONTENT.BENEFITS,
    ]);
    const [message, setMessage] = useState<string | null>(null);

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
            },
        ];
        setBenefits(newItems);
        setDoc(doc(db, "benefits", "main"), { BENEFITS: newItems })
            .then(() => setMessage("Beneficios actualizados"))
            .catch((e) =>
                setMessage("Error guardando beneficios: " + String(e))
            );
    }
    function updateBenefit(idx: number, field: string, value: string) {
        const newItems = benefits.map((it, i) =>
            i === idx ? { ...it, [field]: value } : it
        );
        setBenefits(newItems);
        setDoc(doc(db, "benefits", "main"), { BENEFITS: newItems })
            .then(() => setMessage("Beneficios actualizados"))
            .catch((e) =>
                setMessage("Error guardando beneficios: " + String(e))
            );
    }
    function removeBenefit(idx: number) {
        const newItems = benefits.filter((_, i) => i !== idx);
        setBenefits(newItems);
        setDoc(doc(db, "benefits", "main"), { BENEFITS: newItems })
            .then(() => setMessage("Beneficios actualizados"))
            .catch((e) =>
                setMessage("Error guardando beneficios: " + String(e))
            );
    }

    async function saveSection() {
        try {
            await setDoc(doc(db, "benefits", "main"), { BENEFITS: benefits });
            setMessage("Beneficios guardados");
        } catch (err: any) {
            setMessage(
                "Error guardando beneficios: " + (err.message || String(err))
            );
        }
    }

    function restoreDefaults() {
        setBenefits(DEFAULT_CONTENT.BENEFITS);
        setMessage("Beneficios restaurados a defaults (aún no guardados)");
    }

    return (
        <section className="mb-6 p-4 border rounded bg-background/50">
            <h2 className="font-semibold mb-3">Beneficios</h2>
            {benefits.map((b: any, idx: number) => (
                <div key={b.id || idx} className="mb-3 border-b pb-2">
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
                            updateBenefit(idx, "description", e.target.value)
                        }
                        rows={2}
                        className="w-full p-2 rounded border"
                    />
                    <div className="flex justify-end mt-1">
                        <button
                            onClick={() => removeBenefit(idx)}
                            className="px-2 py-1 border rounded"
                        >
                            Eliminar
                        </button>
                    </div>
                </div>
            ))}
            <div className="flex gap-2 mt-2">
                <button
                    onClick={addBenefit}
                    className="px-3 py-2 bg-primary text-background rounded"
                >
                    Agregar beneficio
                </button>
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

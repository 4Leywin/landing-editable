"use client";
import { useState, useEffect } from "react";
import { getById, setItem } from "@/services/firebase/content";
import toast from "react-hot-toast";

export default function SiteTab() {
    const [siteName, setSiteName] = useState("Luxury Star Spa");
    const [loading, setLoading] = useState(false);

    // Cargar datos desde Firebase
    useEffect(() => {
        const loadData = async () => {
            try {
                const doc = await getById<any>("site", "main");
                if (doc?.SITE_NAME) {
                    setSiteName(doc.SITE_NAME);
                }
            } catch (err) {
                console.error("Error loading site data:", err);
            }
        };
        loadData();
    }, []);

    const handleSave = async () => {
        setLoading(true);
        try {
            await setItem("site", "main", {
                SITE_NAME: siteName,
            });
            toast.success("✅ Nombre del sitio guardado correctamente");
        } catch (err) {
            console.error("Error saving site data:", err);
            toast.error("❌ Error al guardar el nombre del sitio");
        } finally {
            setLoading(false);
        }
    };

    const handleRestore = () => {
        setSiteName("Luxury Star Spa");
        toast("🔄 Nombre del sitio restaurado al valor por defecto");
    };

    return (
        <div className="border border-border p-4 rounded bg-background">
            <h2 className="text-xl font-bold mb-4">Configuración del Sitio</h2>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">
                        Nombre del Sitio
                    </label>
                    <input
                        type="text"
                        value={siteName}
                        onChange={(e) => setSiteName(e.target.value)}
                        placeholder="Ej: Luxury Star Spa"
                        className="w-full px-3 py-2 border border-border rounded bg-background text-foreground"
                    />
                    <p className="text-xs text-foreground/60 mt-1">
                        Este nombre aparecerá en la barra de navegación
                    </p>
                </div>

                <div className="flex gap-2 mt-4">
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="px-4 py-2 bg-primary text-background rounded hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Guardando..." : "💾 Guardar Cambios"}
                    </button>
                    <button
                        onClick={handleRestore}
                        className="px-4 py-2 border border-border rounded hover:bg-secondary"
                    >
                        🔄 Restaurar Default
                    </button>
                </div>
            </div>
        </div>
    );
}

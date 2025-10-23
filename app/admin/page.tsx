"use client";
import { useEffect, useState } from "react";
import { DEFAULT_CONTENT } from "../../lib/content";
import HeroTab from "../../components/admin/HeroTab";
import NavTab from "../../components/admin/NavTab";
import BenefitsTab from "../../components/admin/BenefitsTab";
import ContactTab from "../../components/admin/ContactTab";
import GalleryTab from "../../components/admin/GalleryTab";
import { auth } from "@/services/firebase/client";

export default function AdminPage() {
    const [content, setContent] = useState<any>(DEFAULT_CONTENT);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<
        "site" | "hero" | "nav" | "benefits" | "contact" | "gallery"
    >("site");

    useEffect(() => {
        let mounted = true;
        async function load() {
            try {
                const res = await fetch("/api/content");
                if (!res.ok) throw new Error("no content api");
                const json = await res.json();
                if (!mounted) return;
                const merged = { ...DEFAULT_CONTENT, ...json };
                setContent(merged);
            } catch (err) {
                // fallback to defaults
                setContent(DEFAULT_CONTENT);
            } finally {
                if (mounted) setLoading(false);
            }
        }
        load();
        return () => {
            mounted = false;
        };
    }, []);
    console.log("Current user:", auth.currentUser);

    return (
        <div className="min-h-screen bg-background text-foreground p-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-4">
                    Admin — Formulario de personalización
                </h1>
                <p className="text-sm text-foreground/70 mb-4">
                    Completa los formularios para personalizar la página. Usa
                    "Aplicar local" para ver los cambios inmediatamente, o
                    "Guardar en servidor" para persistir.
                </p>

                <div>
                    {/* Tabs */}
                    <div className="mb-4 flex gap-2 flex-wrap">
                        {[
                            ["hero", "Hero"],
                            ["nav", "Navegación"],
                            ["benefits", "Beneficios"],
                            ["contact", "Contacto"],
                            ["gallery", "Galería"],
                        ].map(([key, label]) => (
                            <button
                                key={key}
                                onClick={() => setActiveTab(key as any)}
                                className={`px-3 py-1 rounded ${
                                    activeTab === key
                                        ? "bg-primary text-background"
                                        : "border"
                                }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>

                    <div className="grid gap-6">
                        <div>
                            {activeTab === "hero" && <HeroTab />}
                            {activeTab === "nav" && <NavTab />}
                            {activeTab === "benefits" && <BenefitsTab />}
                            {activeTab === "contact" && <ContactTab />}
                            {activeTab === "gallery" && <GalleryTab />}

                            <div className="mt-2 text-sm text-foreground/70">
                                Usa los botones "Guardar sección" dentro de cada
                                pestaña para persistir sólo esa sección, o
                                restaura defaults por sección con "Restaurar
                                defaults".
                            </div>

                            {message && (
                                <p className="mt-3 text-sm text-foreground/80">
                                    {message}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

"use client";
import { useEffect, useState } from "react";
import { DEFAULT_CONTENT } from "../../lib/content";
import HeroTab from "../../components/admin/HeroTab";
import NavTab from "../../components/admin/NavTab";
import BenefitsTab from "../../components/admin/BenefitsTab";
import ContactTab from "../../components/admin/ContactTab";
import CtasTab from "../../components/admin/CtasTab";
import GalleryTab from "../../components/admin/GalleryTab";
import PricesTab from "../../components/admin/PricesTab";
import FaqsTab from "../../components/admin/FaqsTab";
import Faqs2Tab from "../../components/admin/Faqs2Tab";
import TestimonialsTab from "../../components/admin/TestimonialsTab";
import TherapistsTab from "../../components/admin/TherapistsTab";
import { auth } from "@/services/firebase/client";
import ToastClient from "@/components/toast.client";

export default function AdminPage() {
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [activeTab, setActiveTab] = useState<
        | "hero"
        | "nav"
        | "benefits"
        | "contact"
        | "ctas"
        | "gallery"
        | "prices"
        | "faqs1"
        | "faqs2"
        | "testimonials"
        | "therapists"
    >("hero");

    useEffect(() => {
        // Escuchar cambios en la autenticación
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
            }
            setLoading(false); // Solo aquí, después de determinar el estado real
        });

        // Cleanup
        return () => unsubscribe();
    }, []);

    // Pantalla de carga
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-6">
                <p>Cargando...</p>
            </div>
        );
    }
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

                {/* Tabs */}
                <div className="mb-4 flex gap-2 flex-wrap">
                    {[
                        ["hero", "Hero"],
                        ["benefits", "Beneficios"],
                        ["contact", "Contacto"],
                        ["ctas", "CTA"],
                        ["gallery", "Galería"],
                        ["prices", "Precios"],
                        ["faqs1", "Preguntas (FAQS 1)"],
                        ["faqs2", "Preguntas (FAQS 2)"],
                        ["testimonials", "Testimonios"],
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
                    {activeTab === "hero" && <HeroTab />}
                    {activeTab === "benefits" && <BenefitsTab />}
                    {activeTab === "contact" && <ContactTab />}
                    {activeTab === "ctas" && <CtasTab />}
                    {activeTab === "gallery" && <GalleryTab />}
                    {activeTab === "prices" && <PricesTab />}
                    {activeTab === "faqs1" && <FaqsTab />}
                    {activeTab === "faqs2" && <Faqs2Tab />}
                    {activeTab === "testimonials" && <TestimonialsTab />}
                    {activeTab === "therapists" && <TherapistsTab />}

                    <div className="mt-2 text-sm text-foreground/70">
                        Usa los botones "Guardar sección" dentro de cada pestaña
                        para persistir sólo esa sección, o restaura defaults por
                        sección con "Restaurar defaults".
                    </div>

                    {message && (
                        <p className="mt-3 text-sm text-foreground/80">
                            {message}
                        </p>
                    )}
                </div>
            </div>
            <ToastClient />
        </div>
    );
}

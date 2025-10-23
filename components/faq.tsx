"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const faqs = [
        {
            question: "¿Qué es exactamente el masaje tántrico?",
            answer: "El masaje tántrico es una práctica ancestral que combina técnicas de masaje profesional con principios de energía y consciencia corporal. Busca despertar la energía vital, mejorar la conexión con el cuerpo y promover el bienestar integral.",
        },
        {
            question: "¿Es un servicio discreto y confidencial?",
            answer: "Absolutamente. La discreción y privacidad son pilares fundamentales de nuestro servicio. Todos nuestros clientes son tratados con total confidencialidad y respeto.",
        },
        {
            question: "¿Cuál es la duración de una sesión?",
            answer: "Nuestras sesiones tienen una duración de 60, 90 o 120 minutos, dependiendo del ritual que elijas. Cada sesión es personalizada según tus necesidades.",
        },
        {
            question: "¿Necesito experiencia previa?",
            answer: "No. Nuestras terapeutas están capacitadas para trabajar con clientes de todos los niveles. Si es tu primera vez, te guiaremos a través de toda la experiencia.",
        },
        {
            question: "¿Cuál es la política de cancelación?",
            answer: "Las cancelaciones deben realizarse con al menos 24 horas de anticipación para recibir un reembolso completo. Las cancelaciones de último momento pueden estar sujetas a cargos.",
        },
        {
            question: "¿Ofrecen servicios para parejas?",
            answer: "Sí, ofrecemos rituales especiales para parejas que deseen compartir una experiencia transformadora juntos. Contáctanos para más detalles.",
        },
    ];

    return (
        <section className="py-24 px-4 bg-linear-to-b from-background to-accent/20">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-16">
                    <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-4">
                        ✦ Preguntas Frecuentes
                    </p>
                    <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
                        Resolvemos tus Dudas
                    </h2>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, idx) => (
                        <div
                            key={idx}
                            className="border border-border rounded-lg overflow-hidden bg-background/50 backdrop-blur-sm hover:border-primary/50 transition-colors"
                        >
                            <button
                                className="w-full p-6 flex justify-between items-center text-left hover:bg-accent/20 transition-colors"
                                onClick={() =>
                                    setOpenIndex(openIndex === idx ? null : idx)
                                }
                            >
                                <h3 className="font-semibold text-foreground pr-4">
                                    {faq.question}
                                </h3>
                                <ChevronDown
                                    size={20}
                                    className={`text-primary shrink-0 transition-transform duration-300 ${
                                        openIndex === idx ? "rotate-180" : ""
                                    }`}
                                />
                            </button>
                            {openIndex === idx && (
                                <div className="px-6 pb-6 text-foreground/70 border-t border-border pt-4">
                                    {faq.answer}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

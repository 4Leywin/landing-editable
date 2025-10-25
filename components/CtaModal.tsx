"use client";

import { useState } from "react";

interface CtaItem {
    label: string;
    url: string;
    active?: boolean;
}

interface CtaModalProps {
    ctas: CtaItem[];
}

export default function CtaModal({ ctas }: CtaModalProps) {
    const [isOpen, setIsOpen] = useState(false);

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    return (
        <>
            {/* Botón principal */}
            <div className="md:col-span-2 flex justify-center">
                <button
                    onClick={openModal}
                    className="cursor-pointer group px-12 py-6 bg-primary text-background font-semibold rounded-xl hover:bg-primary-dark transition-all hover:scale-105 shadow-lg hover:shadow-xl text-xl flex items-center justify-center gap-3"
                >
                    <span>📅</span>
                    <span>Reserva tu Sesión</span>
                </button>
            </div>

            {/* Modal */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    onClick={closeModal}
                >
                    {/* Backdrop con blur */}
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

                    {/* Contenido del modal */}
                    <div
                        className="relative bg-background rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Botón de cerrar */}
                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
                            aria-label="Cerrar modal"
                        >
                            <span className="text-2xl">✕</span>
                        </button>

                        {/* Título del modal */}
                        <div className="text-center mb-8">
                            <h3 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
                                Elige tu
                                <span className="block text-primary">
                                    Experiencia
                                </span>
                            </h3>
                            <p className="text-foreground/70 text-lg">
                                Selecciona el ritual que más resuene contigo
                            </p>
                        </div>

                        {/* CTAs en el modal */}
                        <div className="grid gap-4">
                            {ctas.map((cta) => (
                                <a
                                    key={cta.label}
                                    href={cta.url}
                                    className="group px-8 py-6 bg-primary text-background font-semibold rounded-xl hover:bg-primary-dark transition-all hover:scale-102 shadow-lg hover:shadow-xl text-lg flex items-center justify-center gap-3"
                                    onClick={closeModal}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <span>📅</span>
                                    <span>{cta.label}</span>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

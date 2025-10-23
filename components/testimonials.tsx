"use client";

import { useInView } from "react-intersection-observer";
import { Star } from "lucide-react";

export default function Testimonials() {
    const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true });

    const testimonials = [
        {
            name: "Carlos M.",
            age: 29,
            text: "Nunca había sentido algo así. Salí completamente relajado, con más energía y como si mi mente estuviera despejada. Realmente transforma tu forma de sentirte.",
            rating: 5,
        },
        {
            name: "Javier R.",
            age: 41,
            text: "Me sorprendió lo conectado que me sentí cuerpo a cuerpo y con mis emociones. Fue una experiencia única que definitivamente repetiré.",
            rating: 5,
        },
        {
            name: "Diego F.",
            age: 50,
            text: "Al principio dudaba, pero después de la sesión entendí lo poderoso que es este masaje Sensitivo. Relajación profunda, compañía agradable, trato de pareja y energía renovada en una sola hora. Me atendió Cattalleya.",
            rating: 5,
        },
    ];

    return (
        <section className="py-24 px-4 bg-linear-to-b from-background via-background/80 to-accent/10 relative overflow-hidden">
            <div className="max-w-6xl mx-auto relative z-10" ref={ref}>
                <div className="text-center mb-16">
                    <p className="text-primary text-sm font-semibold tracking-[0.25em] uppercase mb-3">
                        ✦ Testimonios
                    </p>
                    <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
                        Experiencias que Marcan un Antes y un Después
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg">
                        Voces reales que descubrieron el poder del tacto
                        consciente y la conexión emocional.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, idx) => (
                        <div
                            key={idx}
                            className={`p-8 rounded-2xl border border-border bg-accent/20 backdrop-blur-md shadow-lg hover:shadow-xl transition-all duration-700 hover:border-primary/60 transform hover:-translate-y-2 ${
                                inView
                                    ? "animate-fade-in-up"
                                    : "opacity-0 translate-y-8"
                            }`}
                            style={{ animationDelay: `${idx * 0.3}s` }}
                        >
                            <div className="flex gap-1 mb-4">
                                {Array.from({ length: testimonial.rating }).map(
                                    (_, i) => (
                                        <Star
                                            key={i}
                                            size={16}
                                            className="fill-primary text-primary"
                                        />
                                    )
                                )}
                            </div>
                            <p className="text-foreground/90 mb-4 leading-relaxed italic text-lg">
                                “{testimonial.text}”
                            </p>
                            <p className="font-semibold text-foreground/95">
                                — {testimonial.name},{" "}
                                <span className="text-muted-foreground">
                                    {testimonial.age} años
                                </span>
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Efecto de fondo decorativo */}
            <div className="absolute inset-0 bg-gradient-radial from-primary/10 via-transparent to-transparent blur-3xl opacity-60"></div>
        </section>
    );
}

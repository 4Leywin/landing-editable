"use client";

import { useInView } from "react-intersection-observer";

export default function Therapists() {
    const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true });

    const therapists = [
        {
            name: "Valentina",
            specialty: "Masaje Tántrico Clásico",
            image: "/placeholder.svg?height=400&width=300",
            bio: "Especialista en técnicas ancestrales con 8 años de experiencia.",
        },
        {
            name: "Isabela",
            specialty: "Masaje Energético",
            image: "/placeholder.svg?height=400&width=300",
            bio: "Experta en equilibrio energético y consciencia corporal.",
        },
        {
            name: "Catalina",
            specialty: "Masaje Sensorial",
            image: "/placeholder.svg?height=400&width=300",
            bio: "Especialista en despertar sensorial y presencia plena.",
        },
    ];

    return (
        <section id="therapists" className="py-24 px-4 bg-background" ref={ref}>
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-4">
                        ✦ Nuestras Terapeutas
                    </p>
                    <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
                        Maestras del Arte Tántrico
                    </h2>
                    <p className="text-foreground/60 text-lg max-w-2xl mx-auto">
                        Profesionales certificadas, discretas y dedicadas a tu
                        bienestar integral.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {therapists.map((therapist, idx) => (
                        <div
                            key={idx}
                            className={`group cursor-pointer transition-all duration-500 ${
                                inView ? "animate-fade-in-up" : "opacity-0"
                            }`}
                            style={{ animationDelay: `${idx * 0.2}s` }}
                        >
                            <div className="relative overflow-hidden rounded-lg mb-4 h-96 bg-accent">
                                <img
                                    src={therapist.image || "/placeholder.svg"}
                                    alt={therapist.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>
                            <h3 className="font-serif text-2xl font-bold text-foreground mb-1">
                                {therapist.name}
                            </h3>
                            <p className="text-primary text-sm font-semibold mb-2">
                                {therapist.specialty}
                            </p>
                            <p className="text-foreground/60 text-sm">
                                {therapist.bio}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

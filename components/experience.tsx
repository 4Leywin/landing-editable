"use client";

import { useInView } from "react-intersection-observer";
import { Heart, Zap, Compass } from "lucide-react";
import { useEffect, useState } from "react";
import { BENEFITS as BENEFITS_FALLBACK } from "../lib/content";
import { getById } from "@/services/firebase/content";

export default function Experience() {
    const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true });
    const [benefits, setBenefits] = useState<any[]>([...BENEFITS_FALLBACK]);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const data = await getById<any>("benefits", "main");
                if (!mounted) return;
                setBenefits(data?.BENEFITS ?? BENEFITS_FALLBACK);
            } catch (e) {
                setBenefits(BENEFITS_FALLBACK);
            }
        })();
        return () => {
            mounted = false;
        };
    }, []);

    const experiences = [
        { icon: Heart, ...(benefits[0] ?? BENEFITS_FALLBACK[0]) },
        { icon: Zap, ...(benefits[1] ?? BENEFITS_FALLBACK[1]) },
        { icon: Compass, ...(benefits[2] ?? BENEFITS_FALLBACK[2]) },
    ];

    return (
        <section
            id="beneficios"
            className="py-24 px-4 bg-linear-to-b from-background to-accent/20"
            ref={ref}
        >
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-4">
                        ✦ Beneficios
                    </p>
                    <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
                        Beneficios principales
                    </h2>
                    <p className="text-foreground/60 text-lg max-w-2xl mx-auto">
                        Una transformación sensorial que despierta tu
                        consciencia y te reconecta con tu esencia más profunda.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {experiences.map((exp, idx) => {
                        const Icon = exp.icon;
                        return (
                            <div
                                key={idx}
                                className={`p-8 rounded-lg border border-border bg-background/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-500 ${
                                    inView ? "animate-fade-in-up" : "opacity-0"
                                }`}
                                style={{ animationDelay: `${idx * 0.2}s` }}
                            >
                                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                                    <Icon className="text-primary" size={24} />
                                </div>
                                <h3 className="font-serif text-xl font-bold text-foreground mb-3">
                                    {exp.title}
                                </h3>
                                <p className="text-foreground/70 leading-relaxed">
                                    {exp.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

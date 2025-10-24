"use client";

import { useInView } from "react-intersection-observer";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";

export default function PricingClient({
    prices,
    note,
}: {
    prices: any[];
    note?: string;
}) {
    const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true });
    const [localInView, setLocalInView] = useState<boolean>(false);

    useEffect(() => {
        if (inView) setLocalInView(true);
    }, [inView]);
    console.log("Rendering PricingClient with prices:", prices);
    return (
        <section id="pricing" className="py-24 px-4 bg-background" ref={ref}>
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-4">
                        ✦ Nuestras tarifas
                    </p>
                    <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
                        Elige tu Experiencia
                    </h2>
                    <p className="text-foreground/60 text-lg">
                        Cada ritual está diseñado para una transformación única
                    </p>
                </div>

                {/* Render any number of price items from centralized data */}
                <div className="grid md:grid-cols-3 gap-8">
                    {prices.map((item: any, idx: number) => (
                        <div
                            key={item.id || idx}
                            className={`relative rounded-lg border transition-all duration-500 ${
                                localInView ? "animate-fade-in-up" : "opacity-0"
                            } ${
                                item.premium
                                    ? "border-primary bg-linear-to-b from-primary/10 to-background scale-105 md:scale-110"
                                    : "border-border bg-background/50 backdrop-blur-sm hover:border-primary/50"
                            }`}
                            style={{ animationDelay: `${idx * 0.12}s` }}
                        >
                            {item.premium && (
                                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                    <span className="bg-primary text-background px-4 py-1 rounded-full text-sm font-semibold">
                                        PREMIUM
                                    </span>
                                </div>
                            )}

                            <div className="p-8">
                                <h3 className="font-serif text-2xl font-bold text-foreground mb-2">
                                    {item.name}
                                </h3>
                                {item.duration && (
                                    <p className="text-primary text-sm font-semibold mb-2">
                                        {item.duration}
                                    </p>
                                )}
                                {item.description && (
                                    <p className="text-foreground/60 text-sm mb-4">
                                        {item.description}
                                    </p>
                                )}

                                <div className="mb-6">
                                    <span className="font-serif text-4xl font-bold text-primary">
                                        {item.price}
                                    </span>
                                </div>

                                <button
                                    className={`w-full py-3 rounded-full font-semibold transition-all mb-6 ${
                                        item.premium
                                            ? "bg-primary text-background hover:bg-primary-dark"
                                            : "border-2 border-primary text-primary hover:bg-primary/10"
                                    }`}
                                >
                                    Agendar Ahora
                                </button>

                                {item.features && item.features.length > 0 && (
                                    <div className="space-y-3">
                                        {item.features.map(
                                            (f: any, i: number) => (
                                                <div
                                                    key={i}
                                                    className="flex gap-3 items-start"
                                                >
                                                    <Check
                                                        size={18}
                                                        className="text-primary shrink-0 mt-0.5"
                                                    />
                                                    <span className="text-foreground/80 text-sm">
                                                        {f}
                                                    </span>
                                                </div>
                                            )
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Nota común para precios */}
                {note && (
                    <div className="mt-12 max-w-3xl mx-auto text-center">
                        <p className="text-foreground/60 text-sm">{note}</p>
                    </div>
                )}
            </div>
        </section>
    );
}

"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function FAQClient({ faqs }: { faqs: any[] }) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

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
                    {faqs.map((faq: any, idx: number) => (
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
                                    {faq.q || faq.question}
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
                                    {faq.a || faq.answer}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

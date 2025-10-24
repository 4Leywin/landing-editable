"use client";

import { useEffect, useState } from "react";
import { SCHEDULE as SCHEDULE_FALLBACK } from "../lib/content";
import { getById } from "@/services/firebase/content";

export default function Schedule() {
    const [schedule, setSchedule] = useState<any[]>([...SCHEDULE_FALLBACK]);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const data = await getById<any>("schedule", "main");
                if (!mounted) return;
                setSchedule(data?.SCHEDULE ?? SCHEDULE_FALLBACK);
            } catch (e) {
                setSchedule(SCHEDULE_FALLBACK);
            }
        })();
        return () => {
            mounted = false;
        };
    }, []);

    return (
        <section id="schedule" className="py-20 px-4 bg-background">
            <div className="max-w-4xl mx-auto text-center">
                <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-4">
                    ✦ Horarios
                </p>
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-6">
                    Nuestros horarios
                </h2>

                <div className="grid gap-4 md:grid-cols-2">
                    {schedule.map((s: any) => (
                        <div
                            key={s.id}
                            className="p-6 border border-border rounded-lg bg-background/50"
                        >
                            <div className="flex items-baseline justify-between">
                                <div className="font-semibold text-lg text-left">
                                    {s.days}
                                </div>
                                <div className="text-primary font-serif font-bold">
                                    {s.hours}
                                </div>
                            </div>
                            {s.note && (
                                <div className="text-foreground/60 text-sm mt-2">
                                    {s.note}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

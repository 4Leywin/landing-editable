"use client";
import { useEffect, useState, useRef } from "react";

const STORAGE_KEY = "cta_timer_end";

function formatRemaining(ms: number) {
    if (ms <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    const totalSec = Math.floor(ms / 1000);
    const days = Math.floor(totalSec / (24 * 60 * 60));
    const hours = Math.floor((totalSec % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((totalSec % (60 * 60)) / 60);
    const seconds = totalSec % 60;
    return { days, hours, minutes, seconds };
}

export default function CtaTimer({
    defaultMinutes = 2880, // 2 días = 2 * 24 * 60 = 2880 minutos
}: {
    defaultMinutes?: number;
}) {
    const [endTs, setEndTs] = useState<number | null>(null);
    const [remaining, setRemaining] = useState<number>(0);
    const intervalRef = useRef<number | null>(null);

    useEffect(() => {
        // load from localStorage; if none or expired, auto-start timer
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            const now = Date.now();
            if (raw) {
                const ts = Number(raw);
                if (!Number.isNaN(ts) && ts > now) {
                    setEndTs(ts);
                    return;
                }
            }

            // No valid stored timer: auto-start a new one
            const autoTs = now + Number(defaultMinutes) * 60 * 1000;
            localStorage.setItem(STORAGE_KEY, String(autoTs));
            setEndTs(autoTs);
        } catch (e) {
            // ignore
        }
    }, []);

    useEffect(() => {
        function tick() {
            if (!endTs) {
                setRemaining(0);
                return;
            }
            const rem = endTs - Date.now();
            setRemaining(rem > 0 ? rem : 0);
            if (rem <= 0) {
                // clear stored key when expired
                try {
                    localStorage.removeItem(STORAGE_KEY);
                } catch (e) {}
                setEndTs(null);
            }
        }

        tick();
        if (intervalRef.current) window.clearInterval(intervalRef.current);
        intervalRef.current = window.setInterval(tick, 1000);
        return () => {
            if (intervalRef.current) window.clearInterval(intervalRef.current);
        };
    }, [endTs]);

    // startTimer / clearTimer removed — timer auto-starts and persists

    const isActive = remaining > 0;
    const timeLeft = formatRemaining(remaining);

    return (
        <div
            className={`mb-6 p-6 rounded-xl max-w-2xl mx-auto transition-all shadow-lg flex flex-col items-center justify-center ${
                isActive
                    ? "bg-linear-to-r from-red-500 to-pink-500 text-white ring-4 ring-red-300"
                    : "bg-background/40"
            }`}
            aria-live="polite"
        >
            <div className="text-center">
                <div className="text-sm uppercase tracking-widest mb-4 font-semibold">
                    Oferta limitada
                </div>
                <div className="flex gap-4 md:gap-6 items-center justify-center">
                    {/* Días */}
                    <div className="flex flex-col items-center">
                        <div className="text-4xl md:text-6xl font-extrabold leading-none">
                            {String(timeLeft.days).padStart(2, "0")}
                        </div>
                        <div className="text-xs md:text-sm mt-1 opacity-80 uppercase">
                            Días
                        </div>
                    </div>
                    <div className="text-4xl md:text-6xl font-extrabold leading-none">
                        :
                    </div>
                    {/* Horas */}
                    <div className="flex flex-col items-center">
                        <div className="text-4xl md:text-6xl font-extrabold leading-none">
                            {String(timeLeft.hours).padStart(2, "0")}
                        </div>
                        <div className="text-xs md:text-sm mt-1 opacity-80 uppercase">
                            Horas
                        </div>
                    </div>
                    <div className="text-4xl md:text-6xl font-extrabold leading-none">
                        :
                    </div>
                    {/* Minutos */}
                    <div className="flex flex-col items-center">
                        <div className="text-4xl md:text-6xl font-extrabold leading-none">
                            {String(timeLeft.minutes).padStart(2, "0")}
                        </div>
                        <div className="text-xs md:text-sm mt-1 opacity-80 uppercase">
                            Min
                        </div>
                    </div>
                    <div className="text-4xl md:text-6xl font-extrabold leading-none">
                        :
                    </div>
                    {/* Segundos */}
                    <div className="flex flex-col items-center">
                        <div className="text-4xl md:text-6xl font-extrabold leading-none">
                            {String(timeLeft.seconds).padStart(2, "0")}
                        </div>
                        <div className="text-xs md:text-sm mt-1 opacity-80 uppercase">
                            Seg
                        </div>
                    </div>
                </div>
                <div className="mt-4 text-sm opacity-80">
                    Aprovecha antes de que termine
                </div>
            </div>
        </div>
    );
}

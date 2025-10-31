"use client";

import { ChevronDown } from "lucide-react";
import { HERO as HERO_FALLBACK } from "../lib/content";
import { getById } from "@/services/firebase/content";
import { useState, useRef, useEffect } from "react";

function HeroVideo({ videoSrc }: { videoSrc: string }) {
    const [isMuted, setIsMuted] = useState(true);
    const videoRef = useRef<HTMLVideoElement>(null);

    const toggleMute = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    return (
        <div className="relative w-full h-full group">
            <video
                ref={videoRef}
                autoPlay
                muted={isMuted}
                loop
                className="w-full h-full object-cover object-center"
                poster="/placeholder.svg?height=720&width=1280"
                {...({ fetchPriority: "high" } as any)}
                preload="metadata"
            >
                <source src={videoSrc} type="video/mp4" />
            </video>
            {/* Botón de volumen */}
            <button
                onClick={toggleMute}
                className="absolute top-4 right-4 z-50 bg-black/70 hover:bg-black/90 text-white p-2.5 rounded-full transition-all shadow-lg backdrop-blur-sm pointer-events-auto"
                aria-label={isMuted ? "Activar sonido" : "Desactivar sonido"}
            >
                {isMuted ? (
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                        />
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
                        />
                    </svg>
                ) : (
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                        />
                    </svg>
                )}
            </button>
        </div>
    );
}

export default function Hero() {
    const [HERO, setHERO] = useState<any>(HERO_FALLBACK);

    useEffect(() => {
        async function load() {
            try {
                const data = await getById<any>("hero", "main");
                console.log("Fetched HERO data:", data);
                setHERO(data?.HERO ?? HERO_FALLBACK);
            } catch (e) {
                setHERO(HERO_FALLBACK);
            }
        }
        load();
    }, []);

    return (
        <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-12">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-linear-to-b from-background via-background/80 to-background z-0" />

            {/* Content - Video and Text Side by Side */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 w-full">
                <div
                    className={`grid md:grid-cols-2 gap-12 md:items-start transition-all duration-1000 opacity-100`}
                >
                    {/* Video / Image Section */}
                    <div className="flex justify-center md:justify-start">
                        <div
                            className={`relative w-full rounded-2xl overflow-hidden shadow-2xl border border-primary/30 sm:aspect-3/4 md:aspect-square md:max-w-[560px] lg:max-w-[700px]`}
                        >
                            {HERO?.videoSrc ? (
                                <HeroVideo videoSrc={HERO.videoSrc} />
                            ) : (
                                <img
                                    src={
                                        HERO?.image ||
                                        "/placeholder.svg?height=720&width=1280"
                                    }
                                    alt={HERO?.title || "hero"}
                                    className="w-full h-full object-cover object-center"
                                    {...({ fetchpriority: "high" } as any)}
                                />
                            )}
                            {/* Overlay decorativo */}
                            <div className="absolute inset-0 bg-linear-to-t from-background/40 to-transparent pointer-events-none" />
                        </div>
                    </div>

                    {/* Text Section */}
                    <div className="text-left md:text-left">
                        <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-4 animate-fade-in-up">
                            ✦ Bienvenido al Ritual Dorado
                        </p>

                        <h1 className="font-serif text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight animate-fade-in-up">
                            {HERO.title}
                        </h1>
                        <p className="text-foreground/90 text-lg md:text-xl mb-4 leading-relaxed animate-fade-in-up">
                            {HERO.subtitle}
                        </p>

                        <p className="text-foreground/70 text-sm md:text-base mb-8 leading-relaxed animate-fade-in-up">
                            {HERO.description}
                        </p>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div
                    className={`absolute top-[110%] left-1/2 transform -translate-x-1/2  transition-all duration-1000 opacity-100`}
                >
                    <div className="animate-bounce">
                        <ChevronDown className="text-primary" size={32} />
                    </div>
                </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-20 right-10 w-32 h-32 border border-primary/20 rounded-full opacity-30 animate-pulse" />
            <div className="absolute bottom-20 left-10 w-24 h-24 border border-primary/20 rounded-full opacity-20 animate-pulse" />
        </section>
    );
}

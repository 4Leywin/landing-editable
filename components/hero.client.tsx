"use client";

import { useState, useRef } from "react";

interface HeroClientProps {
    videoSrc?: string;
    image?: string;
    title: string;
    subtitle: string;
    description: string;
}

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
                playsInline
                className="w-full h-full object-cover object-center"
                {...({ fetchPriority: "high" } as any)}
                preload="auto"
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

export default function HeroClient({
    videoSrc,
    image,
    title,
    subtitle,
    description,
}: HeroClientProps) {
    return (
        <>
            {/* Video / Image Section */}
            <div className="flex justify-center md:justify-start">
                <div
                    className={`relative w-full rounded-2xl overflow-hidden shadow-2xl border border-primary/30 sm:aspect-3/4 md:aspect-square md:max-w-[560px] lg:max-w-[700px]`}
                >
                    {videoSrc ? (
                        <HeroVideo videoSrc={videoSrc} />
                    ) : (
                        <img
                            src={
                                image ||
                                "/placeholder.svg?height=720&width=1280"
                            }
                            alt={title || "hero"}
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
                    {title}
                </h1>
                <p className="text-foreground/90 text-lg md:text-xl mb-4 leading-relaxed animate-fade-in-up">
                    {subtitle}
                </p>

                <p className="text-foreground/70 text-sm md:text-base mb-8 leading-relaxed animate-fade-in-up">
                    {description}
                </p>
            </div>
        </>
    );
}

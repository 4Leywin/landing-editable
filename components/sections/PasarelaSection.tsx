"use client";
import React, { useEffect, useState, useRef } from "react";
import { useInView } from "react-intersection-observer";
import DEFAULT_CONTENT from "../../lib/content";

export default function PasarelaSection() {
    const { ref, inView } = useInView({ threshold: 0.15, triggerOnce: true });
    const [videoSrc, setVideoSrc] = useState<string>("");
    const [posterSrc, setPosterSrc] = useState<string>("/placeholder.jpg");
    const [isMobile, setIsMobile] = useState<boolean>(false);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [showPlayOverlay, setShowPlayOverlay] = useState(false);

    useEffect(() => {
        function updateSrc() {
            if (typeof window === "undefined") return;
            const mobile = window.innerWidth <= 768;
            setIsMobile(mobile);
            if (mobile) {
                // no mobile video placeholder available in /public, use image fallback
                setVideoSrc("");
                setPosterSrc("/placeholder.jpg");
            } else {
                // no desktop video placeholder available in /public, use image fallback
                setVideoSrc("");
                setPosterSrc("/placeholder.jpg");
            }
        }
        updateSrc();
        window.addEventListener("resize", updateSrc);
        return () => window.removeEventListener("resize", updateSrc);
    }, []);

    useEffect(() => {
        async function tryAutoplay() {
            if (!videoRef.current) return;
            try {
                const p = videoRef.current.play();
                if (p instanceof Promise) {
                    await p;
                    setShowPlayOverlay(false);
                }
            } catch (err) {
                setShowPlayOverlay(true);
            }
        }
        const v = videoRef.current;
        if (v) tryAutoplay();
    }, [videoSrc, inView]);

    return (
        <section id="pasarela" ref={ref} className="py-12 px-4">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <div
                    className={`w-full flex justify-center md:justify-start ${
                        inView ? "animate-fade-in-up" : "opacity-0"
                    }`}
                >
                    <div
                        className={`w-full ${
                            isMobile ? "max-w-xs" : "max-w-lg"
                        } rounded-2xl overflow-hidden shadow-lg border border-border bg-black`}
                    >
                        <div
                            className={`relative w-full ${
                                isMobile ? "h-[60vh]" : "h-[520px]"
                            } lg:h-[720px]`}
                        >
                            {videoSrc ? (
                                <video
                                    ref={videoRef}
                                    className={`absolute inset-0 w-full h-full object-cover`}
                                    controls
                                    playsInline
                                    muted
                                    loop
                                    autoPlay
                                    preload="metadata"
                                    poster={posterSrc}
                                >
                                    <source src={videoSrc} type="video/mp4" />
                                    Tu navegador no soporta video.
                                </video>
                            ) : (
                                <img
                                    src={posterSrc}
                                    alt="placeholder"
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                            )}

                            {showPlayOverlay && (
                                <button
                                    onClick={() => {
                                        try {
                                            videoRef.current?.play();
                                            setShowPlayOverlay(false);
                                        } catch (e) {
                                            // no-op
                                        }
                                    }}
                                    aria-label="Reproducir video"
                                    className="absolute inset-0 flex items-center justify-center"
                                >
                                    <span className="w-20 h-20 rounded-full bg-primary/90 text-background flex items-center justify-center shadow-lg">
                                        ▶
                                    </span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div
                    className={`w-full ${
                        inView ? "animate-fade-in-up" : "opacity-0"
                    }`}
                >
                    <div className="mb-6">
                        <h3 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
                            PREGUNTAS FRECUENTES
                        </h3>
                    </div>

                    <div className="space-y-6">
                        {(DEFAULT_CONTENT.FAQS || []).map((item, idx) => (
                            <details
                                key={idx}
                                className="group bg-background/50 border border-border rounded-lg p-5"
                                open={idx === 0}
                            >
                                <summary className="cursor-pointer list-none font-semibold text-foreground/90">
                                    {item.q}
                                </summary>
                                <div className="mt-3 text-foreground/70 leading-relaxed whitespace-pre-wrap">
                                    {item.a}
                                </div>
                            </details>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

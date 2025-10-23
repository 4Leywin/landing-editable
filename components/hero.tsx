import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useIsMobile } from "@/hooks/useIsMobile";
import { HERO as HERO_FALLBACK } from "../lib/content";
import { useContent } from "../lib/useContent";

export default function Hero() {
    const { content, loading } = useContent();
    const [isLoaded, setIsLoaded] = useState(false);
    const isMobile = useIsMobile();

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    const HERO = content && content.HERO ? content.HERO : HERO_FALLBACK;

    return (
        <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-12">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-linear-to-b from-background via-background/80 to-background z-0" />

            {/* Content - Video and Text Side by Side */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 w-full">
                <div
                    className={`grid md:grid-cols-2 gap-12 items-center transition-all duration-1000 ${
                        isLoaded ? "opacity-100" : "opacity-0"
                    }`}
                >
                    {/* Video Section */}
                    <div className="flex justify-center">
                        <div
                            className={`relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl border border-primary/30 ${
                                isMobile ? "max-w-xs" : "max-w-md"
                            }`}
                        >
                            <video
                                autoPlay
                                muted
                                loop
                                className="w-full h-full object-cover"
                                poster="/placeholder.svg?height=720&width=1280"
                            >
                                <source src={HERO.videoSrc} type="video/mp4" />
                            </video>
                            {/* Overlay decorativo */}
                            <div className="absolute inset-0 bg-linear-to-t from-background/40 to-transparent" />
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
                    className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 transition-all duration-1000 ${
                        isLoaded ? "opacity-100" : "opacity-0"
                    }`}
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

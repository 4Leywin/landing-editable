import { ChevronDown } from "lucide-react";
import { HERO as HERO_FALLBACK } from "../lib/content";
import { getById } from "@/services/firebase/content";
import HeroClient from "./hero.client";

// Server Component - precarga datos en el servidor
export default async function Hero() {
    // Cargar datos del hero en el servidor
    let HERO = HERO_FALLBACK;
    try {
        const data = await getById<any>("hero", "main");
        HERO = data?.HERO ?? HERO_FALLBACK;
    } catch (e) {
        console.warn("Failed to load hero data, using fallback", e);
        HERO = HERO_FALLBACK;
    }

    return (
        <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-12">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-linear-to-b from-background via-background/80 to-background z-0" />

            {/* Content - Video and Text Side by Side */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 w-full">
                <div
                    className={`grid md:grid-cols-2 gap-12 md:items-start transition-all duration-1000 opacity-100`}
                >
                    <HeroClient
                        videoSrc={HERO.videoSrc}
                        image={(HERO as any).image}
                        title={HERO.title}
                        subtitle={HERO.subtitle}
                        description={HERO.description}
                    />
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

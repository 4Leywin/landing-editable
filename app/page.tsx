"use client";

import { useState, useEffect } from "react";
import Hero from "@/components/hero";
import Experience from "@/components/experience";
import Therapists from "@/components/therapists";
import Gallery from "@/components/gallery";
import FAQ from "@/components/faq";
import Testimonials from "@/components/testimonials";
import Pricing from "@/components/pricing";
import CTA from "@/components/cta";
import Navigation from "@/components/navigation";
import PasarelaSection from "@/components/sections/PasarelaSection";
import InstalacionesSection from "@/components/sections/InstalacionesSection";
import Schedule from "@/components/Schedule";

export default function Home() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <main className="bg-background text-foreground overflow-hidden">
            <Navigation scrolled={scrolled} />
            <Hero />
            <Experience />
            <PasarelaSection />
            <InstalacionesSection />
            {/* <Therapists /> */}
            <Testimonials />
            <Pricing />
            <Schedule />
            <Gallery />
            <CTA />
        </main>
    );
}

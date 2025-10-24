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
import { getById } from "@/services/firebase/content";
import { DEFAULT_CONTENT } from "@/lib/content";
import ToastClient from "@/components/toast.client";
export default async function Home() {
    // Try to read nav items from Firestore (collection: 'nav_items', doc: 'main')
    let navItems = DEFAULT_CONTENT.NAV_ITEMS;
    try {
        const doc = await getById("nav_items", "main");
        if (
            doc &&
            (doc as any).NAV_ITEMS &&
            Array.isArray((doc as any).NAV_ITEMS)
        ) {
            navItems = (doc as any).NAV_ITEMS;
        }
    } catch (err) {
        // keep fallback NAV_ITEMS from DEFAULT_CONTENT on error
        console.warn(
            "Failed to load nav items from Firestore, using defaults.",
            err
        );
    }

    return (
        <main className="bg-background text-foreground overflow-hidden">
            <Navigation navItems={navItems} />
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

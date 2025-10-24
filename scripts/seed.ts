import DEFAULT_CONTENT from "../lib/content";
import { db } from "@/services/firebase/client";
import { doc, setDoc } from "firebase/firestore";

// Helper interno para ejecutar la persistencia de una sección
async function runSave(
    sectionKey: string,
    value: any,
    options?: {
        saveFn?: (payload: any) => Promise<void> | void;
        collectionName?: string; // override the collection name if needed
    }
) {
    const payload = { [sectionKey]: value };
    if (options?.saveFn) {
        await options.saveFn(payload);
        return payload;
    }
    try {
        // Firestore requires an object; wrap arrays/primitives in the payload object so
        // documents always contain a top-level key named after the section (e.g. { RESOURCES: [...] })
        const collection = options?.collectionName ?? sectionKey.toLowerCase();
        await setDoc(doc(db, collection, "main"), payload);
        console.log(
            `Seeder (${sectionKey}): escrito en Firestore -> collection='${collection}', doc='main'`
        );
        return payload;
    } catch (err) {
        console.error(
            `Seeder (${sectionKey}): error escribiendo en Firestore`,
            err
        );
        // Fallback: imprimir payload
        console.log(JSON.stringify(payload, null, 2));
        return payload;
    }
}

// --- Getters ---
export function getSeedContent() {
    return { ...(DEFAULT_CONTENT as any) } as any;
}

export function getHero() {
    return { ...(DEFAULT_CONTENT as any).HERO };
}

export function getNavItems() {
    return [...((DEFAULT_CONTENT as any).NAV_ITEMS ?? [])];
}

export function getBenefits() {
    return [...((DEFAULT_CONTENT as any).BENEFITS ?? [])];
}

export function getContact() {
    return { ...(DEFAULT_CONTENT as any).CONTACT };
}

export function getResources() {
    return [...((DEFAULT_CONTENT as any).RESOURCES ?? [])];
}

export function getSchedule() {
    return [...((DEFAULT_CONTENT as any).SCHEDULE ?? [])];
}

export function getFaqs() {
    return [...((DEFAULT_CONTENT as any).FAQS ?? [])];
}

export function getFaqs2() {
    return [...((DEFAULT_CONTENT as any).FAQS_2 ?? [])];
}

export function getCtas() {
    return [...((DEFAULT_CONTENT as any).CTAS ?? [])];
}

export function getTherapists() {
    return [...((DEFAULT_CONTENT as any).THERAPISTS ?? [])];
}

export function getTestimonials() {
    return [...((DEFAULT_CONTENT as any).TESTIMONIALS ?? [])];
}

export function getSite() {
    return { ...(DEFAULT_CONTENT as any).SITE };
}

export function getFooterNote() {
    return (DEFAULT_CONTENT as any).FOOTER_NOTE;
}

export function getPrices() {
    return [...((DEFAULT_CONTENT as any).PRICES ?? [])];
}

// --- Seeders por sección ---
export function seedHero(options?: {
    saveFn?: (payload: any) => Promise<void> | void;
}) {
    return runSave("HERO", getHero(), options);
}

export function seedNavItems(options?: {
    saveFn?: (payload: any) => Promise<void> | void;
}) {
    return runSave("NAV_ITEMS", getNavItems(), options);
}

export function seedBenefits(options?: {
    saveFn?: (payload: any) => Promise<void> | void;
}) {
    return runSave("BENEFITS", getBenefits(), options);
}

export function seedContact(options?: {
    saveFn?: (payload: any) => Promise<void> | void;
}) {
    return runSave("CONTACT", getContact(), options);
}

export function seedResources(options?: {
    saveFn?: (payload: any) => Promise<void> | void;
}) {
    return runSave("RESOURCES", getResources(), options);
}

export function seedSchedule(options?: {
    saveFn?: (payload: any) => Promise<void> | void;
}) {
    return runSave("SCHEDULE", getSchedule(), options);
}

export function seedFaqs(options?: {
    saveFn?: (payload: any) => Promise<void> | void;
}) {
    // write payload { FAQS: [...] } into collection 'faq1' (doc 'main')
    return runSave("FAQS", getFaqs(), {
        ...(options ?? {}),
        collectionName: "faq1",
    });
}

export function seedFaqs2(options?: {
    saveFn?: (payload: any) => Promise<void> | void;
}) {
    // write payload { FAQS_2: [...] } into collection 'faq2' (doc 'main')
    return runSave("FAQS_2", getFaqs2(), {
        ...(options ?? {}),
        collectionName: "faq2",
    });
}

export function seedCtas(options?: {
    saveFn?: (payload: any) => Promise<void> | void;
}) {
    return runSave("CTAS", getCtas(), options);
}

export function seedTherapists(options?: {
    saveFn?: (payload: any) => Promise<void> | void;
}) {
    return runSave("THERAPISTS", getTherapists(), options);
}

export function seedTestimonials(options?: {
    saveFn?: (payload: any) => Promise<void> | void;
}) {
    return runSave("TESTIMONIALS", getTestimonials(), options);
}

export function seedSite(options?: {
    saveFn?: (payload: any) => Promise<void> | void;
}) {
    return runSave("SITE", getSite(), options);
}

export function seedFooterNote(options?: {
    saveFn?: (payload: any) => Promise<void> | void;
}) {
    return runSave("FOOTER_NOTE", getFooterNote(), options);
}

export function seedPrices(options?: {
    saveFn?: (payload: any) => Promise<void> | void;
}) {
    return runSave("PRICES", getPrices(), options);
}

// Ejecuta todos los seeders en orden. Opcionalmente se puede pasar saveFn que se llamará para cada sección.
export async function seedAll(options?: {
    saveFn?: (payload: any) => Promise<void> | void;
}) {
    const results: Record<string, any> = {};

    results.HERO = await seedHero(options);
    results.NAV_ITEMS = await seedNavItems(options);
    results.BENEFITS = await seedBenefits(options);
    results.CONTACT = await seedContact(options);
    results.RESOURCES = await seedResources(options);
    results.SCHEDULE = await seedSchedule(options);
    results.FAQS = await seedFaqs(options);
    results.FAQS_2 = await seedFaqs2(options);
    results.CTAS = await seedCtas(options);
    results.THERAPISTS = await seedTherapists(options);
    results.TESTIMONIALS = await seedTestimonials(options);
    results.SITE = await seedSite(options);
    results.FOOTER_NOTE = await seedFooterNote(options);
    results.PRICES = await seedPrices(options);

    return results;
}

seedAll();

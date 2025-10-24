// Server component wrapper: fetch prices from Firestore and render a small client component
import { PRICES as PRICES_FALLBACK, PRICES_NOTE } from "../lib/prices";
import { getById } from "@/services/firebase/content";
import PricingClient from "./pricing.client";

export default async function Pricing() {
    // Server-side fetch from Firestore collection 'prices', doc 'main'
    let prices = PRICES_FALLBACK;
    try {
        const doc = await getById<any>("prices", "main");
        console.log("Fetched prices document:", doc);
        if (doc) {
            prices = doc.PRICES;
        }
    } catch (err) {
        // keep fallback
        console.warn(
            "pricing: failed to read prices from Firestore, using fallback",
            err
        );
    }

    return <PricingClient prices={prices} note={PRICES_NOTE} />;
}

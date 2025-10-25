// Server component wrapper: fetch prices from Firestore and render a small client component
import { PRICES as PRICES_FALLBACK, PRICES_NOTE } from "../lib/prices";
import { getById } from "@/services/firebase/content";
import PricingClient from "./pricing.client";

export default async function Pricing() {
    // Server-side fetch from Firestore collection 'prices', doc 'main'
    let prices = PRICES_FALLBACK;
    try {
        const doc = await getById<any>("prices", "main");
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
    // filter out deactivated prices (if `active` flag exists)
    if (Array.isArray(prices)) {
        prices = prices.filter((p: any) => p.active !== false);
    }
    return <PricingClient prices={prices} note={PRICES_NOTE} />;
}

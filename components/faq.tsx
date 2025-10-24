import { getById } from "@/services/firebase/content";
import { FAQS as FAQS_FALLBACK } from "../lib/content";
import FAQClient from "./faq.client";

export default async function FAQ() {
    let faqs = FAQS_FALLBACK;
    try {
        const doc = await getById<any>("faqs", "main");
        if (doc) {
            if (Array.isArray(doc.FAQS)) faqs = doc.FAQS;
            else if (Array.isArray(doc.faqs)) faqs = doc.faqs;
            else if (Array.isArray(doc)) faqs = doc as any[];
        }
    } catch (err) {
        console.warn(
            "FAQ: failed to read faqs from Firestore, using fallback",
            err
        );
    }

    return <FAQClient faqs={faqs} />;
}

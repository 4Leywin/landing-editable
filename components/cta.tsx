import { getById } from "@/services/firebase/content";
import {
    CTAS as CTAS_FALLBACK,
    CONTACT as CONTACT_FALLBACK,
    FOOTER_NOTE as FOOTER_NOTE_FALLBACK,
} from "../lib/content";
import CtaTimer from "./CtaTimer";

export default async function CTA() {
    let ctas = CTAS_FALLBACK;
    let contact = CONTACT_FALLBACK;
    let footer = FOOTER_NOTE_FALLBACK;

    try {
        const doc = await getById<any>("ctas", "main");
        if (doc) {
            ctas = doc.CTAS;
        }
        const docContact = await getById<any>("contact", "main");
        console.log("Fetched contact document:", docContact);
        if (docContact) {
            contact = docContact.CONTACT;
        }

        const docFooter = await getById<any>("footer_note", "main");
        if (docFooter) {
            footer = docFooter.FOOTER_NOTE;
        }
    } catch (err) {
        // keep fallbacks
        console.warn(
            "CTA: failed to read CTAS from Firestore, using fallbacks",
            err
        );
    }

    return (
        <section
            id="contact"
            className="py-24 px-4 bg-linear-to-b from-background to-accent/20 relative overflow-hidden"
        >
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-96 h-96 border border-primary/10 rounded-full opacity-20" />
            <div className="absolute bottom-0 left-0 w-72 h-72 border border-primary/10 rounded-full opacity-20" />

            <div className="max-w-5xl mx-auto relative z-10">
                <div className="text-center mb-16">
                    <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-4">
                        ✦ Próximo Paso
                    </p>

                    <h2 className="font-serif text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
                        Atrévete a Sentir
                        <span className="block text-primary">Distinto</span>
                    </h2>

                    <p className="text-foreground/70 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                        Tu ritual dorado te espera. Elige tu camino hacia la
                        transformación y descubre una nueva dimensión de
                        bienestar, energía y conexión profunda.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-16">
                    {/* Countdown timer (client) */}
                    <div className="md:col-span-2 flex justify-center">
                        <CtaTimer />
                    </div>
                    {ctas.map((cta: any) => (
                        <a
                            key={cta.label}
                            href={cta.url}
                            className="group px-8 py-6 bg-primary text-background font-semibold rounded-xl hover:bg-primary-dark transition-all hover:scale-105 shadow-lg hover:shadow-xl text-lg flex items-center justify-center gap-3"
                        >
                            <span>📅</span>
                            <span>{cta.label}</span>
                        </a>
                    ))}
                </div>

                {/* Contact Info */}
                <div className="grid md:grid-cols-3 gap-8 pt-12 border-t border-border">
                    <div>
                        <p className="text-primary font-semibold text-lg mb-2">
                            📍 Ubicación
                        </p>
                        <p className="text-foreground/70">{contact.address}</p>
                    </div>
                    <div>
                        <p className="text-primary font-semibold text-lg mb-2">
                            📞 Contacto
                        </p>
                        <p className="text-foreground/70">{contact.phone}</p>
                    </div>
                    <div>
                        <p className="text-primary font-semibold text-lg mb-2">
                            ⏰ Disponibilidad
                        </p>
                        <p className="text-foreground/70">
                            {contact.availability}
                        </p>
                    </div>
                </div>

                <p className="text-foreground/50 text-sm mt-12 text-center">
                    {footer}
                </p>
                <div className="text-foreground/50 text-sm mt-2 text-center">
                    Powered by{" "}
                    <a
                        href="https://kleincode.studio/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline"
                    >
                        Klein Code
                    </a>
                </div>
            </div>
        </section>
    );
}

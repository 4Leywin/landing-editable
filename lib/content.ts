export type ScheduleItem = {
    id: string;
    days: string;
    hours: string;
    note?: string;
};

export const SCHEDULE: ScheduleItem[] = [
    {
        id: "weekday",
        days: "Lunes a Sábado",
        hours: "10:30 am - 9:00 pm",
        note: "solo con cita/reserva",
    },
    {
        id: "sunday",
        days: "Domingos",
        hours: "11:00 am - 6:00 pm",
    },
];

export type ResourceItem = {
    id: string;
    type: "image" | "video";
    src: string;
    title?: string;
    subtitle?: string;
    note?: string;
    // metadata is a flat map of key → value (e.g. { nombre: 'maria', pais: 'pe', edad: 26 })
    metadata?: Record<string, string | number>;
};
export type PriceItem = {
    id: string;
    name: string;
    price: string;
    duration?: string;
    description?: string;
    features?: string[];
    premium?: boolean;
    category?: string;
};
// Recursos planos: imágenes y videos con metadata. Editable por el cliente.
export const RESOURCES: ResourceItem[] = [
    {
        id: "r1",
        type: "video",
        src: "https://res.cloudinary.com/dnbxp946z/video/upload/v1761201043/qe3mfawt3xra0sk9xye3.mp4",
        title: "Sonrisa natural",
        subtitle: "Sesión reciente",
        metadata: { nombre: "María", pais: "Perú", edad: 26 },
    },
    {
        id: "r2",
        type: "video",
        src: "https://res.cloudinary.com/dnbxp946z/video/upload/v1761201044/baeb2qwohszh41rsgkro.mp4",
        title: "Ambiente",
        subtitle: "Sala privada",
        metadata: { ubicacion: "Lima" },
    },
    {
        id: "r3",
        type: "video",
        src: "https://res.cloudinary.com/dnbxp946z/video/upload/v1761201045/nofijgkvlgxlot0zhvpw.mp4",
        title: "Preview sesión",
        subtitle: "10s",
        metadata: { duracion: "10s" },
    },
    {
        id: "r4",
        type: "video",
        src: "https://res.cloudinary.com/dnbxp946z/video/upload/v1761200972/uaxwchsvoob1mjlottqg.mp4",
        title: "Perfil",
        subtitle: "foto reciente",
        metadata: { nombre: "Lucía", pais: "Perú" },
    },
    {
        id: "r5",
        type: "video",
        src: "https://res.cloudinary.com/dnbxp946z/video/upload/v1761200972/szcmeawpmgednt0o6i4r.mp4",
        title: "Perfil",
        subtitle: "foto reciente",
        metadata: { nombre: "Lucía", pais: "Perú" },
    },
    {
        id: "r6",
        type: "video",
        src: "https://res.cloudinary.com/dnbxp946z/video/upload/v1761200933/ccnhrp7xkvv9p5ndeql3.mp4",
        title: "Perfil",
        subtitle: "foto reciente",
        metadata: { nombre: "Lucía", pais: "Perú" },
    },
];

export const GALLERY_NOTE =
    "Énfasis en contenido real y sin filtros — fotos y mini videos disponibles";

// --- Centralized site content for easy editing ---
export const SITE = {
    name: "Ritual Dorado",
    year: 2025,
};

export const HERO = {
    videoSrc: "/placeholder.mp4",
    title: "DISFRUTA DE TU MASAJE TÁNTRICO CON 40 Soles de DESCUENTO",
    subtitle:
        '"Vive una experiencia sensual y relajante como nunca antes, somos 8 masajistas a escoger."',
    description:
        "Si hasta los 30 minutos no quedas completamente a gusto, puedes cambiar de masajista una vez más. Y si aun así no disfrutas la experiencia, te devolvemos EL 100% DE TU DINERO — GARANTÍA DE SATISFACCIÓN TOTAL. Experiencia Garantizada.",
};

export const NAV_ITEMS = [
    { label: "Beneficios", href: "#beneficios" },
    { label: "Terapeutas", href: "#therapists" },
    { label: "Galería", href: "#gallery" },
    { label: "Precios", href: "#pricing" },
    { label: "Contacto", href: "#contact" },
];

export const BENEFITS = [
    {
        id: "b1",
        title: "Relajación profunda y reducción del estrés",
        description: "Libera tensiones físicas y mentales.",
    },
    {
        id: "b2",
        title: "Aumento de energía y vitalidad",
        description: "Recarga tu cuerpo y mente con nueva energía.",
    },
    {
        id: "b3",
        title: "Potencia la sensualidad y la intimidad",
        description: "Libera bloqueos emocionales y energéticos.",
    },
];

export const PRICES: PriceItem[] = [
    // Ejemplo: el cliente puede eliminar/añadir tantos items como quiera aquí
    {
        id: "masaje-gold",
        name: "Masaje Gold",
        price: "S/200",
        duration: "1 hora",
        description: "Masaje tántrico profesional con aroma y ambiente premium",
        features: [
            "Masaje tántrico profesional",
            "Aromaterapia personalizada",
            "Ambiente privado",
        ],
        premium: true,
        category: "PREMIUM",
    },
    {
        id: "masaje-tantrico",
        name: "Masaje Tántrico",
        price: "S/140",
        duration: "1 hora",
        description: "Sesión tradicional enfocada en relajación y energía",
        features: [
            "Consulta inicial",
            "Masaje 1 hora",
            "Técnicas de respiración",
        ],
        premium: false,
        category: "BÁSICO",
    },
    {
        id: "sin-lenceria",
        name: "Sin lencería",
        price: "S/150",
        duration: "30 minutos",
        description: "Sesión corta sin vestimenta especial",
        features: ["30 minutos", "Ambiente relajante"],
        premium: false,
        category: "BÁSICO",
    },
];

export const FAQS = [
    {
        q: "HAY OTRO TIPOS DE SERVICIO COMO FINAL FELIZ?",
        a: `Brindamos Sesiones Tántricas "SIN" Pen👉👌etración ni Ora👅les. ¿Has tenido esta experiencia antes?`,
    },
    {
        q: "PUEDO RESERVAR Y BENEFICIARME DE LOS DESCUENTOS?",
        a: `Si tienes clara esta experiencia única y diferente. El precio por hora es de 200 soles, pero al reservar obtendrás un descuento especial de 40 soles, pagando solo 160 soles en total. Como ya habrás abonado 20 soles al hacer tu reserva, únicamente pagarás 140 soles en recepción.`,
    },
    {
        q: "QUE PASARIA SI LA CHICA NO ES IGUAL DE LA FOTO?",
        a: `Las fotos son reales y por eso ponemos un mini-video de cada una de ellas, para que quedes 100% seguro. Pero recuerda: si el servicio no te agrada, máximo en 30 minutos puedes cambiar de masajista y si tampoco estás a gusto, TE DEVOLVEMOS TU DINERO. Tu sesión está GARANTIZADA. (aplicable solo en masaje de 1 hora)`,
    },
    {
        q: "QUE PASARIA SI NO PUEDO LLEGAR A LA CITA, ME DEVUELVEN MI DINERO?",
        a: `Si avisas con 3 horas de antelación podemos programarte otra cita nueva y si por un motivo externo deseas la devolución, encantadas de devolverte y más adelante podríamos volver a quedar.`,
    },
    {
        q: "NO DESEO RESERVAR Y PAGAR EN RECEPCION?",
        a: `NO es obligatorio RESERVAR, pero como no has contactado por esta promoción, si RESERVAS DE PALABRA podemos darte un descuento de 20 soles; es decir, en lugar de pagar 200 soles por 1 hora, pagarías 180 soles.`,
    },
    {
        q: "QUE PASARIA SI NO VOY A LA CITA ?",
        a: `No pasaría nada, pero avisa. Ten en cuenta que la terapeuta ya reservó tu cita; el espacio dejará de atender esperando por ti. Trata de asistir si ya has quedado en ir.`,
    },
];

export const CONTACT = {
    address: "Miraflores, Lima",
    phone: "+51 1 XXXX-XXXX",
    availability: "Lunes a Domingo 6PM-2AM",
};

export const CTAS = [
    { label: "Agenda tu Ritual Dorado", url: "#" },
    { label: "Contacta por WhatsApp", url: "#" },
    { label: "Llamada Directa", url: "#" },
    { label: "Envía tu Consulta", url: "#" },
];

export const FOOTER_NOTE = `© ${SITE.year} ${SITE.name}. Todos los derechos reservados. Discreción y profesionalismo garantizados.`;

export const DEFAULT_CONTENT = {
    SITE,
    HERO,
    NAV_ITEMS,
    BENEFITS,
    FAQS,
    CONTACT,
    CTAS,
    FOOTER_NOTE,
    RESOURCES,
    GALLERY_NOTE,
    SCHEDULE,
    PRICES,
};

export default DEFAULT_CONTENT;

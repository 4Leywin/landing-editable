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

export const PRICES_NOTE = "Precios válidos con cualquier método de pago";

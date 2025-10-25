import { setItem } from "./content";

/**
 * Función para inicializar datos por defecto en Firebase
 */
export async function seedFirestore() {
    try {
        // Crear documento inicial para el nombre del sitio
        await setItem("site", "main", {
            SITE_NAME: "Luxury Star Spa",
        });

        console.log("✅ Firestore seeded successfully with site data");
    } catch (error) {
        console.error("❌ Error seeding Firestore:", error);
        throw error;
    }
}

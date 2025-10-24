"use client";
import { useEffect, useState } from "react";
import { DEFAULT_CONTENT } from "../../lib/content";
import { db } from "@/services/firebase/client";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function NavTab() {
    const [navItems, setNavItems] = useState<any[]>([
        ...DEFAULT_CONTENT.NAV_ITEMS,
    ]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;
        async function load() {
            try {
                const snap = await getDoc(doc(db, "nav_items", "main"));
                const data = snap.exists() ? (snap.data() as any) : null;
                if (!mounted) return;
                setNavItems(data?.NAV_ITEMS ?? DEFAULT_CONTENT.NAV_ITEMS);
            } catch (err) {
                setNavItems(DEFAULT_CONTENT.NAV_ITEMS);
            } finally {
                if (mounted) setLoading(false);
            }
        }
        load();
        return () => {
            mounted = false;
        };
    }, []);

    function addNavItem() {
        const newItems = [...navItems, { label: "Nuevo", href: "#new" }];
        setNavItems(newItems);
        setDoc(doc(db, "nav_items", "main"), { NAV_ITEMS: newItems })
            .then(() => setMessage("Navegación actualizada"))
            .catch((e) =>
                setMessage("Error guardando navegación: " + String(e))
            );
    }
    function updateNavItem(idx: number, field: string, value: string) {
        const newItems = navItems.map((it, i) =>
            i === idx ? { ...it, [field]: value } : it
        );
        setNavItems(newItems);
        setDoc(doc(db, "nav_items", "main"), { NAV_ITEMS: newItems })
            .then(() => setMessage("Navegación actualizada"))
            .catch((e) =>
                setMessage("Error guardando navegación: " + String(e))
            );
    }
    function removeNavItem(idx: number) {
        const newItems = navItems.filter((_, i) => i !== idx);
        setNavItems(newItems);
        setDoc(doc(db, "nav_items", "main"), { NAV_ITEMS: newItems })
            .then(() => setMessage("Navegación actualizada"))
            .catch((e) =>
                setMessage("Error guardando navegación: " + String(e))
            );
    }

    async function saveSection() {
        try {
            await setDoc(doc(db, "nav_items", "main"), { NAV_ITEMS: navItems });
            setMessage("Navegación guardada");
        } catch (err: any) {
            setMessage(
                "Error guardando navegación: " + (err.message || String(err))
            );
        }
    }

    function restoreDefaults() {
        setNavItems(DEFAULT_CONTENT.NAV_ITEMS);
        setMessage("Navegación restaurada a defaults (aún no guardada)");
    }

    return (
        <section className="mb-6 p-4 border rounded bg-background/50">
            <h2 className="font-semibold mb-3">Navegación</h2>
            {navItems.map((n: any, idx: number) => (
                <div key={idx} className="flex gap-2 items-center mb-2">
                    <input
                        value={n.label}
                        onChange={(e) =>
                            updateNavItem(idx, "label", e.target.value)
                        }
                        className="flex-1 p-2 rounded border"
                    />
                    <input
                        value={n.href}
                        onChange={(e) =>
                            updateNavItem(idx, "href", e.target.value)
                        }
                        className="w-44 p-2 rounded border"
                    />
                    <button
                        onClick={() => removeNavItem(idx)}
                        className="px-2 py-1 border rounded"
                    >
                        Eliminar
                    </button>
                </div>
            ))}
            <div className="flex gap-2 mt-2">
                <button
                    onClick={addNavItem}
                    className="px-3 py-2 bg-primary text-background rounded"
                >
                    Agregar item
                </button>
                <button
                    onClick={saveSection}
                    className="px-3 py-2 bg-primary text-background rounded hover:scale-105 transition-transform active:scale-95 duration-1000 cursor-pointer"
                >
                    Guardar sección
                </button>
                <button
                    onClick={restoreDefaults}
                    className="px-3 py-2 border rounded"
                >
                    Restaurar defaults
                </button>
            </div>
            {message && <p className="mt-2 text-sm">{message}</p>}
        </section>
    );
}

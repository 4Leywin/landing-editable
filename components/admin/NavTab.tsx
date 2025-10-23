"use client";
import { useEffect, useState } from "react";
import { DEFAULT_CONTENT } from "../../lib/content";

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
                const res = await fetch("/api/content");
                if (!res.ok) throw new Error("no content api");
                const json = await res.json();
                if (!mounted) return;
                setNavItems(json.NAV_ITEMS ?? DEFAULT_CONTENT.NAV_ITEMS);
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
        setNavItems((s) => [...s, { label: "Nuevo", href: "#new" }]);
    }
    function updateNavItem(idx: number, field: string, value: string) {
        setNavItems((s) =>
            s.map((it, i) => (i === idx ? { ...it, [field]: value } : it))
        );
    }
    function removeNavItem(idx: number) {
        setNavItems((s) => s.filter((_, i) => i !== idx));
    }

    async function saveSection() {
        try {
            const res = await fetch("/api/content", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ NAV_ITEMS: navItems }),
            });
            if (!res.ok) throw new Error("save failed");
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
                    className="px-3 py-2 bg-secondary text-background rounded"
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

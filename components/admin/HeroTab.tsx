"use client";
import { useEffect, useState } from "react";
import { DEFAULT_CONTENT } from "../../lib/content";
import { auth } from "@/services/firebase/client";
import { getAll } from "@/services/firebase/content";
export default function HeroTab() {
    const [hero, setHero] = useState<any>({ ...DEFAULT_CONTENT.HERO });
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;
        async function load() {
            try {
                const data = await getAll("hero");
                console.log("Fetched hero content:", data);
                if (!mounted) return;
                setHero(data);
            } catch (err) {
                setHero(DEFAULT_CONTENT.HERO);
            } finally {
                if (mounted) setLoading(false);
            }
        }
        load();
        return () => {
            mounted = false;
        };
    }, []);

    async function saveSection() {
        try {
            const token = await auth.currentUser?.getIdToken();
            const res = await getAll("hero");
            setMessage("Hero guardado");
        } catch (err: any) {
            setMessage("Error guardando hero: " + (err.message || String(err)));
        }
    }

    function restoreDefaults() {
        setHero(DEFAULT_CONTENT.HERO);
        setMessage("Hero restaurado a defaults (aún no guardado)");
    }

    return (
        <section className="mb-6 p-4 border rounded bg-background/50">
            <h2 className="font-semibold mb-3">Hero</h2>
            <label className="block text-sm">Video src</label>
            <input
                value={hero.videoSrc}
                onChange={(e) => setHero({ ...hero, videoSrc: e.target.value })}
                className="w-full p-2 rounded border mb-2"
            />
            <label className="block text-sm">Título</label>
            <input
                value={hero.title}
                onChange={(e) => setHero({ ...hero, title: e.target.value })}
                className="w-full p-2 rounded border mb-2"
            />
            <label className="block text-sm">Subtítulo</label>
            <input
                value={hero.subtitle}
                onChange={(e) => setHero({ ...hero, subtitle: e.target.value })}
                className="w-full p-2 rounded border mb-2"
            />
            <label className="block text-sm">Descripción</label>
            <textarea
                value={hero.description}
                onChange={(e) =>
                    setHero({ ...hero, description: e.target.value })
                }
                rows={4}
                className="w-full p-2 rounded border"
            />

            <div className="flex gap-2 mt-3">
                <button
                    onClick={saveSection}
                    className="px-3 py-2 bg-primary text-background rounded "
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

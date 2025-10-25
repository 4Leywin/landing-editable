"use client";
import { useEffect, useState } from "react";
import { DEFAULT_CONTENT } from "../../lib/content";
import { db } from "@/services/firebase/client";
import { doc, getDoc, setDoc } from "firebase/firestore";
import toast from "react-hot-toast";
import { uploadVideoFile, uploadImageFile } from "@/services/cloudinary";

export default function HeroMediaTab() {
    const [hero, setHero] = useState<any>({ ...(DEFAULT_CONTENT.HERO || {}) });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        async function load() {
            try {
                const snap = await getDoc(doc(db, "hero", "main"));
                const data = snap.exists() ? (snap.data() as any) : null;
                if (!mounted) return;
                setHero(data?.HERO ?? DEFAULT_CONTENT.HERO);
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

    async function uploadFile(file: File) {
        const t = toast.loading("Subiendo archivo...");
        try {
            const type = file.type.startsWith("video") ? "video" : "image";
            let url = "";
            if (type === "image") url = await uploadImageFile(file, "hero");
            else url = await uploadVideoFile(file, "hero");

            const newHero = { ...hero, videoSrc: url };
            setHero(newHero);
            await setDoc(doc(db, "hero", "main"), { HERO: newHero });
            toast.dismiss(t);
            toast.success("Archivo subido y Hero actualizado");
        } catch (e: any) {
            toast.dismiss(t);
            toast.error("Error subiendo archivo: " + (e?.message || String(e)));
        }
    }

    async function save() {
        try {
            await setDoc(doc(db, "hero", "main"), { HERO: hero });
            toast.success("Hero guardado");
        } catch (e: any) {
            toast.error("Error guardando hero: " + (e?.message || String(e)));
        }
    }

    function restoreDefaults() {
        setHero(DEFAULT_CONTENT.HERO);
        toast("Hero restaurado a defaults (aún no guardado)");
    }

    if (loading) return <div className="p-4">Cargando Hero...</div>;

    return (
        <section className="mb-6 p-4 border rounded bg-background/50">
            <h2 className="font-semibold mb-3">
                Media — Hero (video principal)
            </h2>

            <div className="mb-3">
                <label className="block text-sm">
                    Vista previa / Video actual
                </label>
                <div className="mt-2">
                    {hero?.videoSrc ? (
                        <video
                            src={hero.videoSrc}
                            className="max-h-48 rounded"
                            controls
                        />
                    ) : (
                        <div className="text-foreground/60">
                            Sin video configurado
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-2 items-center">
                <label className="px-2 py-1 border rounded cursor-pointer text-sm inline-flex items-center justify-between">
                    <span>Subir video/imagen</span>
                    <input
                        type="file"
                        accept="image/*,video/*"
                        onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) uploadFile(f);
                            (e.target as HTMLInputElement).value = "";
                        }}
                        className="hidden"
                    />
                </label>

                <div className="flex gap-2 justify-end">
                    <button
                        onClick={save}
                        className="px-3 py-2 bg-primary text-background rounded"
                    >
                        Guardar
                    </button>
                    <button
                        onClick={restoreDefaults}
                        className="px-3 py-2 border rounded"
                    >
                        Restaurar defaults
                    </button>
                </div>
            </div>
        </section>
    );
}

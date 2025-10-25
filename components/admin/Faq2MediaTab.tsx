"use client";
import { useEffect, useState } from "react";
import { DEFAULT_CONTENT } from "../../lib/content";
import { db } from "@/services/firebase/client";
import { doc, getDoc, setDoc } from "firebase/firestore";
import toast from "react-hot-toast";
import { uploadImageFile, uploadVideoFile } from "@/services/cloudinary";

export default function Faq2MediaTab() {
    const [media, setMedia] = useState<any>({
        ...(DEFAULT_CONTENT.FAQ2_MEDIA || {}),
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        async function load() {
            try {
                const snap = await getDoc(doc(db, "faq2_media", "main"));
                const data = snap.exists() ? (snap.data() as any) : null;
                if (!mounted) return;
                setMedia(data?.MEDIA ?? DEFAULT_CONTENT.FAQ2_MEDIA);
            } catch (err) {
                setMedia(DEFAULT_CONTENT.FAQ2_MEDIA);
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
            if (type === "image") url = await uploadImageFile(file, "faq2");
            else url = await uploadVideoFile(file, "faq2");

            const newMedia = { ...media, type, src: url, alt: file.name };
            setMedia(newMedia);
            await setDoc(doc(db, "faq2_media", "main"), { MEDIA: newMedia });
            toast.dismiss(t);
            toast.success("Media subida y guardada");
        } catch (e: any) {
            toast.dismiss(t);
            toast.error("Error subiendo archivo: " + (e?.message || String(e)));
        }
    }

    async function save() {
        try {
            await setDoc(doc(db, "faq2_media", "main"), { MEDIA: media });
            toast.success("Media FAQ2 guardada");
        } catch (e: any) {
            toast.error("Error guardando media: " + (e?.message || String(e)));
        }
    }

    function restoreDefaults() {
        setMedia(DEFAULT_CONTENT.FAQ2_MEDIA);
        toast("Media restaurada a defaults (aún no guardado)");
    }

    if (loading) return <div className="p-4">Cargando media FAQ2...</div>;

    return (
        <section className="mb-6 p-4 border rounded bg-background/50">
            <h2 className="font-semibold mb-3">Media — FAQ 2</h2>

            <div className="mb-3">
                <label className="block text-sm">Vista previa</label>
                <div className="mt-2">
                    {media?.src ? (
                        media.type === "image" ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={media.src}
                                alt={media.alt || "media"}
                                className="max-h-48 rounded"
                            />
                        ) : (
                            <video
                                src={media.src}
                                className="max-h-48 rounded"
                                controls
                            />
                        )
                    ) : (
                        <div className="text-foreground/60">Sin archivo</div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-2 items-center">
                <label className="px-2 py-1 border rounded cursor-pointer text-sm inline-flex items-center justify-between">
                    <span>Subir imagen/video</span>
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

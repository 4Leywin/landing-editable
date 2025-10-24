"use client";
import React from "react";
import { useEffect, useState } from "react";
import { DEFAULT_CONTENT } from "../../lib/content";
import { db } from "@/services/firebase/client";
import { doc, getDoc, setDoc } from "firebase/firestore";
import toast from "react-hot-toast";

export default function ContactTab() {
    const [contact, setContact] = useState<any>({ ...DEFAULT_CONTENT.CONTACT });

    useEffect(() => {
        let mounted = true;
        async function load() {
            try {
                const snap = await getDoc(doc(db, "contact", "main"));
                const data = snap.exists() ? (snap.data() as any) : null;
                if (!mounted) return;
                setContact(data?.CONTACT ?? DEFAULT_CONTENT.CONTACT);
            } catch (err) {
                setContact(DEFAULT_CONTENT.CONTACT);
            }
        }
        load();
        return () => {
            mounted = false;
        };
    }, []);

    async function saveSection() {
        try {
            await setDoc(doc(db, "contact", "main"), { CONTACT: contact });
            toast.success("Contacto guardado");
        } catch (err: any) {
            toast.error(
                "Error guardando contacto: " + (err.message || String(err))
            );
        }
    }

    function restoreDefaults() {
        setContact(DEFAULT_CONTENT.CONTACT);
        toast("Contacto restaurado a defaults (aún no guardado)");
    }

    // Persistir cambios inmediatos al actualizar campos
    useEffect(() => {
        // debounce simple para no spamear escrituras en cada tecla
        const t = setTimeout(() => {
            // autosave: write silently (no toast on success) to avoid spamming on every keystroke
            setDoc(doc(db, "contact", "main"), { CONTACT: contact }).catch(
                (e) =>
                    // only surface errors to the user
                    toast.error("Error actualizando contacto: " + String(e))
            );
        }, 400);
        return () => clearTimeout(t);
    }, [contact]);

    return (
        <section className="mb-6 p-4 border rounded bg-background/50">
            <h2 className="font-semibold mb-3">Contacto</h2>
            <label className="block text-sm">Dirección</label>
            <input
                value={contact.address}
                onChange={(e) =>
                    setContact({ ...contact, address: e.target.value })
                }
                className="w-full p-2 rounded border mb-2"
            />
            <label className="block text-sm">Teléfono</label>
            <input
                value={contact.phone}
                onChange={(e) =>
                    setContact({ ...contact, phone: e.target.value })
                }
                className="w-full p-2 rounded border mb-2"
            />
            <label className="block text-sm">Disponibilidad</label>
            <input
                value={contact.availability}
                onChange={(e) =>
                    setContact({ ...contact, availability: e.target.value })
                }
                className="w-full p-2 rounded border mb-2"
            />

            <div className="flex gap-2 mt-3">
                <button
                    onClick={saveSection}
                    className="px-3 py-2 bg-primary text-background rounded hover:scale-105 transition-transform active:scale-95 duration-1000"
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
            {/* feedback via react-hot-toast */}
        </section>
    );
}

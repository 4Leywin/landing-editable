"use client";
import React from "react";
import { useEffect, useState } from "react";
import { DEFAULT_CONTENT } from "../../lib/content";

export default function ContactTab() {
    const [contact, setContact] = useState<any>({ ...DEFAULT_CONTENT.CONTACT });
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;
        async function load() {
            try {
                const res = await fetch("/api/content");
                if (!res.ok) throw new Error("no content api");
                const json = await res.json();
                if (!mounted) return;
                setContact(json.CONTACT ?? DEFAULT_CONTENT.CONTACT);
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
            const res = await fetch("/api/content", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ CONTACT: contact }),
            });
            if (!res.ok) throw new Error("save failed");
            setMessage("Contacto guardado");
        } catch (err: any) {
            setMessage(
                "Error guardando contacto: " + (err.message || String(err))
            );
        }
    }

    function restoreDefaults() {
        setContact(DEFAULT_CONTENT.CONTACT);
        setMessage("Contacto restaurado a defaults (aún no guardado)");
    }

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

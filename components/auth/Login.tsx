"use client";
import React, { useState } from "react";
import { firebaseService } from "@/services/firebase/auth";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const validate = () => {
        if (!email || !password) {
            toast.error("Por favor completa correo y contraseña");
            return false;
        }
        // basic email check
        const re = /^\S+@\S+\.\S+$/;
        if (!re.test(email)) {
            toast.error("Ingresa un correo válido");
            return false;
        }
        return true;
    };

    const handleLogin = async () => {
        if (!validate()) return;
        setLoading(true);
        try {
            const user = await firebaseService.loginUser(email, password);
            toast.success("Bienvenido — entrando al panel de administración");
            // small delay to show toast
            setTimeout(() => router.push("/admin"), 600);
            console.log("Logged in user:", user);
        } catch (error: any) {
            console.error("Login error:", error);
            const msg = error?.message || "Error al iniciar sesión";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-background/80 to-background p-6">
            <div className="w-full max-w-3xl bg-background/60 backdrop-blur-md rounded-2xl shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-2">
                {/* Left panel - visual */}
                <div className="hidden md:flex flex-col items-center justify-center p-8 bg-linear-to-br from-primary/90 to-accent/80 text-background">
                    <div className="text-center">
                        <h2 className="font-serif text-3xl md:text-4xl font-bold mb-2">
                            Bienvenido
                        </h2>
                        <p className="opacity-90">
                            Accede al panel de administración
                        </p>
                    </div>
                    <div className="mt-6 w-40 h-40 rounded-full bg-white/10 flex items-center justify-center text-4xl">
                        ✨
                    </div>
                </div>

                {/* Right panel - form */}
                <div className="p-8">
                    <h3 className="text-2xl font-bold mb-4">Iniciar sesión</h3>

                    <label className="block text-sm font-medium mb-1">
                        Correo electrónico
                    </label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="tu@correo.com"
                        className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:opacity-60 mb-4"
                        aria-label="Correo electrónico"
                    />

                    <label className="block text-sm font-medium mb-1">
                        Contraseña
                    </label>
                    <div className="relative mb-4">
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Contraseña"
                            className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:opacity-60"
                            aria-label="Contraseña"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((s) => !s)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-foreground/70"
                            aria-label={
                                showPassword
                                    ? "Ocultar contraseña"
                                    : "Mostrar contraseña"
                            }
                        >
                            {showPassword ? "Ocultar" : "Mostrar"}
                        </button>
                    </div>

                    <div className="flex items-center justify-between mb-6">
                        <label className="flex items-center gap-2 text-sm">
                            <input type="checkbox" className="w-4 h-4" />
                            <span className="text-sm">Recuérdame</span>
                        </label>
                        <a className="text-sm text-primary underline" href="#">
                            ¿Olvidaste la contraseña?
                        </a>
                    </div>

                    <button
                        onClick={handleLogin}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-primary text-background font-semibold rounded-full hover:bg-primary-dark transition-colors disabled:opacity-60"
                    >
                        {loading ? (
                            <svg
                                className="w-5 h-5 animate-spin"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    fill="none"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                ></path>
                            </svg>
                        ) : null}
                        <span>
                            {loading ? "Ingresando..." : "Iniciar sesión"}
                        </span>
                    </button>

                    <div className="mt-6 text-center text-sm text-foreground/70">
                        ¿No tienes cuenta?{" "}
                        <a href="#" className="text-primary underline">
                            Contacta al administrador
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;

"use client";
import React from "react";
import { firebaseService } from "@/services/firebase/auth";
import { useRouter } from "next/navigation";
const Login = () => {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const router = useRouter();
    const handleLogin = async () => {
        try {
            const user = await firebaseService.loginUser(email, password);
            console.log("Logged in user:", user);
            router.push("/admin");
        } catch (error) {
            console.error("Login error:", error);
        }
    };
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6">Iniciar Sesión</h2>
                <div className="mb-4">
                    <label
                        className="block text-sm font-medium mb-2"
                        htmlFor="email"
                    >
                        Correo Electrónico
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border border-gray-300 p-2 w-full rounded"
                    />
                </div>
                <div className="mb-6">
                    <label
                        className="block text-sm font-medium mb-2"
                        htmlFor="password"
                    >
                        Contraseña
                    </label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="border border-gray-300 p-2 w-full rounded"
                    />
                </div>
                <button
                    onClick={handleLogin}
                    className="w-full bg-primary text-white p-2 rounded hover:bg-blue-700"
                >
                    Iniciar Sesión
                </button>
            </div>
        </div>
    );
};

export default Login;

"use client"

import { useInView } from "react-intersection-observer"
import { Check } from "lucide-react"

export default function Pricing() {
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true })

  const packages = [
    {
      name: "Ritual Dorado",
      duration: "60 minutos",
      price: 250,
      description: "Introducción perfecta al masaje tántrico",
      features: [
        "Masaje tántrico profesional",
        "Aromaterapia personalizada",
        "Ambiente privado y discreto",
        "Consulta inicial",
      ],
      highlighted: false,
    },
    {
      name: "Ritual Platino",
      duration: "90 minutos",
      price: 350,
      description: "La experiencia completa y transformadora",
      features: [
        "Masaje tántrico avanzado",
        "Aromaterapia y musicoterapia",
        "Ritual de energía corporal",
        "Espacio de meditación",
        "Bebida relajante incluida",
      ],
      highlighted: true,
    },
    {
      name: "Ritual Infinito",
      duration: "120 minutos",
      price: 450,
      description: "La máxima expresión del bienestar",
      features: [
        "Masaje tántrico completo",
        "Ritual energético profundo",
        "Aromaterapia, musicoterapia y cristaloterapia",
        "Meditación guiada",
        "Bebidas y snacks gourmet",
        "Acceso a zona de descanso",
      ],
      highlighted: false,
    },
  ]

  return (
    <section id="pricing" className="py-24 px-4 bg-background" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-4">✦ Nuestros Rituales</p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">Elige tu Experiencia</h2>
          <p className="text-foreground/60 text-lg">Cada ritual está diseñado para una transformación única</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {packages.map((pkg, idx) => (
            <div
              key={idx}
              className={`relative rounded-lg border transition-all duration-500 ${
                inView ? "animate-fade-in-up" : "opacity-0"
              } ${
                pkg.highlighted
                  ? "border-primary bg-gradient-to-b from-primary/10 to-background scale-105 md:scale-110"
                  : "border-border bg-background/50 backdrop-blur-sm hover:border-primary/50"
              }`}
              style={{ animationDelay: `${idx * 0.2}s` }}
            >
              {pkg.highlighted && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary text-background px-4 py-1 rounded-full text-sm font-semibold">
                    Más Popular
                  </span>
                </div>
              )}

              <div className="p-8">
                <h3 className="font-serif text-2xl font-bold text-foreground mb-2">{pkg.name}</h3>
                <p className="text-primary text-sm font-semibold mb-4">{pkg.duration}</p>
                <p className="text-foreground/60 text-sm mb-6">{pkg.description}</p>

                <div className="mb-8">
                  <span className="font-serif text-4xl font-bold text-primary">${pkg.price}</span>
                  <span className="text-foreground/60 text-sm ml-2">USD</span>
                </div>

                <button
                  className={`w-full py-3 rounded-full font-semibold transition-all mb-8 ${
                    pkg.highlighted
                      ? "bg-primary text-background hover:bg-primary-dark"
                      : "border-2 border-primary text-primary hover:bg-primary/10"
                  }`}
                >
                  Agendar Ahora
                </button>

                <div className="space-y-4">
                  {pkg.features.map((feature, fidx) => (
                    <div key={fidx} className="flex gap-3 items-start">
                      <Check size={20} className="text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-foreground/80 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

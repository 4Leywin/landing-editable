"use client"

import { useInView } from "react-intersection-observer"
import { Star } from "lucide-react"

export default function Testimonials() {
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true })

  const testimonials = [
    {
      name: "Marco A.",
      text: "Una experiencia transformadora. El ambiente, la profesionalidad y la energía de las terapeutas es incomparable. Volveré sin dudarlo.",
      rating: 5,
    },
    {
      name: "Sofia L.",
      text: "Finalmente encontré un lugar donde puedo reconectar conmigo misma. Discreto, elegante y absolutamente profesional.",
      rating: 5,
    },
    {
      name: "Diego M.",
      text: "Superó todas mis expectativas. La atención al detalle, la privacidad y la calidad del servicio son excepcionales.",
      rating: 5,
    },
  ]

  return (
    <section className="py-24 px-4 bg-background">
      <div className="max-w-6xl mx-auto" ref={ref}>
        <div className="text-center mb-16">
          <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-4">✦ Testimonios</p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
            Historias de Transformación
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, idx) => (
            <div
              key={idx}
              className={`p-8 rounded-lg border border-border bg-accent/30 backdrop-blur-sm transition-all duration-500 hover:border-primary/50 ${
                inView ? "animate-fade-in-up" : "opacity-0"
              }`}
              style={{ animationDelay: `${idx * 0.2}s` }}
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} size={16} className="fill-primary text-primary" />
                ))}
              </div>
              <p className="text-foreground/80 mb-4 leading-relaxed italic">"{testimonial.text}"</p>
              <p className="font-semibold text-foreground">— {testimonial.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

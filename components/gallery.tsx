"use client"

import { useInView } from "react-intersection-observer"
import { useState } from "react"

export default function Gallery() {
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true })
  const [selectedImage, setSelectedImage] = useState<number | null>(null)

  const images = [
    {
      src: "/placeholder.svg?height=400&width=400",
      alt: "Sala de masaje",
    },
    {
      src: "/placeholder.svg?height=400&width=400",
      alt: "Ambiente relajante",
    },
    {
      src: "/placeholder.svg?height=400&width=400",
      alt: "Detalles del ritual",
    },
    {
      src: "/placeholder.svg?height=400&width=400",
      alt: "Zona de descanso",
    },
    {
      src: "/placeholder.svg?height=400&width=400",
      alt: "Decoración sofisticada",
    },
    {
      src: "/placeholder.svg?height=400&width=400",
      alt: "Atmósfera mística",
    },
  ]

  return (
    <section id="gallery" className="py-24 px-4 bg-gradient-to-b from-background to-accent/20" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-4">✦ Galería Visual</p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">Nuestro Espacio Sagrado</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((image, idx) => (
            <div
              key={idx}
              className={`relative overflow-hidden rounded-lg h-64 cursor-pointer group transition-all duration-500 ${
                inView ? "animate-fade-in-up" : "opacity-0"
              }`}
              style={{ animationDelay: `${idx * 0.1}s` }}
              onClick={() => setSelectedImage(idx)}
            >
              <img
                src={image.src || "/placeholder.svg"}
                alt={image.alt}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="w-12 h-12 border-2 border-primary rounded-full flex items-center justify-center">
                  <span className="text-primary text-xl">+</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {selectedImage !== null && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={images[selectedImage].src || "/placeholder.svg"}
              alt={images[selectedImage].alt}
              className="w-full h-auto rounded-lg"
            />
            <button
              className="absolute top-4 right-4 text-primary hover:text-primary-dark transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              <span className="text-3xl">✕</span>
            </button>
          </div>
        </div>
      )}
    </section>
  )
}

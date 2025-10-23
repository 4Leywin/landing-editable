"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"

interface NavigationProps {
  scrolled: boolean
}

export default function Navigation({ scrolled }: NavigationProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const navItems = [
    { label: "Experiencia", href: "#experience" },
    { label: "Terapeutas", href: "#therapists" },
    { label: "Galería", href: "#gallery" },
    { label: "Precios", href: "#pricing" },
    { label: "Contacto", href: "#contact" },
  ]

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-background/95 backdrop-blur-md border-b border-border" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-background font-serif font-bold text-lg">✦</span>
            </div>
            <span className="font-serif text-xl font-bold text-primary hidden sm:inline">Ritual Dorado</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <button className="px-6 py-2 bg-primary text-background font-semibold rounded-full hover:bg-primary-dark transition-colors">
              Agendar
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-primary" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 border-t border-border">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block py-2 text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <button className="w-full mt-4 px-6 py-2 bg-primary text-background font-semibold rounded-full hover:bg-primary-dark transition-colors">
              Agendar
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}

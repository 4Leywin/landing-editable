"use client"

export default function CTA() {
  return (
    <section id="contact" className="py-24 px-4 bg-gradient-to-b from-background to-accent/20 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 border border-primary/10 rounded-full opacity-20" />
      <div className="absolute bottom-0 left-0 w-72 h-72 border border-primary/10 rounded-full opacity-20" />

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-4">✦ Próximo Paso</p>

          <h2 className="font-serif text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            Atrévete a Sentir
            <span className="block text-primary">Distinto</span>
          </h2>

          <p className="text-foreground/70 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Tu ritual dorado te espera. Elige tu camino hacia la transformación y descubre una nueva dimensión de
            bienestar, energía y conexión profunda.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-16">
          <button className="group px-8 py-6 bg-primary text-background font-semibold rounded-xl hover:bg-primary-dark transition-all hover:scale-105 shadow-lg hover:shadow-xl text-lg flex items-center justify-center gap-3">
            <span>📅</span>
            <span>Agenda tu Ritual Dorado</span>
          </button>

          <button className="group px-8 py-6 border-2 border-primary text-primary font-semibold rounded-xl hover:bg-primary/10 transition-all text-lg flex items-center justify-center gap-3">
            <span>💬</span>
            <span>Contacta por WhatsApp</span>
          </button>

          <button className="group px-8 py-6 border-2 border-primary/50 text-foreground font-semibold rounded-xl hover:border-primary hover:bg-primary/5 transition-all text-lg flex items-center justify-center gap-3">
            <span>📞</span>
            <span>Llamada Directa</span>
          </button>

          <button className="group px-8 py-6 border-2 border-primary/50 text-foreground font-semibold rounded-xl hover:border-primary hover:bg-primary/5 transition-all text-lg flex items-center justify-center gap-3">
            <span>✉️</span>
            <span>Envía tu Consulta</span>
          </button>
        </div>

        {/* Contact Info */}
        <div className="grid md:grid-cols-3 gap-8 pt-12 border-t border-border">
          <div>
            <p className="text-primary font-semibold text-lg mb-2">📍 Ubicación</p>
            <p className="text-foreground/70">Miraflores, Lima</p>
          </div>
          <div>
            <p className="text-primary font-semibold text-lg mb-2">📞 Contacto</p>
            <p className="text-foreground/70">+51 1 XXXX-XXXX</p>
          </div>
          <div>
            <p className="text-primary font-semibold text-lg mb-2">⏰ Disponibilidad</p>
            <p className="text-foreground/70">Lunes a Domingo 6PM-2AM</p>
          </div>
        </div>

        <p className="text-foreground/50 text-sm mt-12 text-center">
          © 2025 Ritual Dorado. Todos los derechos reservados. Discreción y profesionalismo garantizados.
        </p>
      </div>
    </section>
  )
}

export default function HeroSection() {
  return (
    <section className="pt-16 apple-bg-light">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="text-center">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light apple-text-gray mb-6 tracking-tight">
            A nova geração de<br />
            <span className="font-semibold">aparelhos digitais</span>
          </h2>
          <p className="text-xl apple-text-medium mb-12 max-w-2xl mx-auto leading-relaxed">
            Descubra nossa coleção cuidadosamente selecionada de dispositivos que combinam 
            tecnologia avançada com design elegante.
          </p>
          <div className="relative max-w-4xl mx-auto">
            <img 
              src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600" 
              alt="Premium wireless headphones" 
              className="w-full h-auto rounded-3xl shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

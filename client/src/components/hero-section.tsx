import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export default function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleLearnMore = () => {
    const element = document.getElementById('products');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleBuy = () => {
    const element = document.getElementById('products');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="pt-12 bg-gradient-to-b from-blue-50 via-blue-75 to-blue-100 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute -bottom-20 left-20 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-25 animate-pulse delay-2000"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 relative z-10">
        <div className="text-center">
          <h1 className={`text-5xl sm:text-6xl lg:text-7xl font-normal apple-text-gray mb-4 tracking-tight transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            AirSound Pro
          </h1>
          <h2 className={`text-2xl sm:text-3xl apple-text-gray mb-2 font-light transition-all duration-1000 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            Som cristalino.
          </h2>
          <h3 className={`text-2xl sm:text-3xl apple-text-gray mb-12 font-light transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            Performance excepcional com tecnologia avançada.
          </h3>
          
          <div className={`flex justify-center space-x-6 mb-16 transition-all duration-1000 delay-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <Button
              onClick={handleLearnMore}
              className="bg-[hsl(207,90%,54%)] hover:bg-[hsl(207,90%,48%)] text-white px-8 py-3 rounded-full font-medium apple-transition hover:shadow-lg hover:scale-105 pulse-glow"
            >
              Saiba mais
            </Button>
            <Button
              onClick={handleBuy}
              variant="outline"
              className="glass-card border-white/30 text-[hsl(207,90%,54%)] hover:bg-[hsl(207,90%,54%)] hover:text-white px-8 py-3 rounded-full font-medium apple-transition hover:scale-105"
            >
              Comprar
            </Button>
          </div>

          <div className={`relative max-w-4xl mx-auto transition-all duration-1000 delay-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            <div className="glass-card rounded-3xl p-8 backdrop-blur-lg">
              <img 
                src="https://images.unsplash.com/photo-1484704849700-f032a568e944?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600" 
                alt="AirSound Pro - Fones de ouvido premium" 
                className="w-full h-auto rounded-2xl shadow-2xl float-animation"
              />
              
              {/* Floating specs */}
              <div className="absolute top-16 -left-8 glass-card rounded-lg p-4 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                <p className="text-sm font-semibold text-gray-800">Cancelamento de Ruído</p>
                <p className="text-xs text-gray-600">Adaptativo</p>
              </div>
              
              <div className="absolute bottom-16 -right-8 glass-card rounded-lg p-4 transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <p className="text-sm font-semibold text-gray-800">Bateria</p>
                <p className="text-xs text-gray-600">30h de reprodução</p>
              </div>
            </div>
          </div>

          <div className={`mt-16 text-center transition-all duration-1000 delay-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <p className="text-lg font-medium mb-2">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-pulse">
                Criado para Inteligência Digital.
              </span>
            </p>
          </div>
        </div>
      </div>
      
      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
    </section>
  );
}

import { Button } from "@/components/ui/button";

export default function HeroSection() {
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
    <section className="pt-12 bg-gradient-to-b from-blue-50 to-blue-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-normal apple-text-gray mb-4 tracking-tight">
            AirSound Pro
          </h1>
          <h2 className="text-2xl sm:text-3xl apple-text-gray mb-2 font-light">
            Som cristalino.
          </h2>
          <h3 className="text-2xl sm:text-3xl apple-text-gray mb-12 font-light">
            Performance excepcional com tecnologia avançada.
          </h3>
          
          <div className="flex justify-center space-x-6 mb-16">
            <Button
              onClick={handleLearnMore}
              className="bg-[hsl(207,90%,54%)] hover:bg-[hsl(207,90%,48%)] text-white px-8 py-3 rounded-full font-medium apple-transition hover:shadow-lg"
            >
              Saiba mais
            </Button>
            <Button
              onClick={handleBuy}
              variant="outline"
              className="border-[hsl(207,90%,54%)] text-[hsl(207,90%,54%)] hover:bg-[hsl(207,90%,54%)] hover:text-white px-8 py-3 rounded-full font-medium apple-transition"
            >
              Comprar
            </Button>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <img 
              src="https://images.unsplash.com/photo-1484704849700-f032a568e944?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600" 
              alt="AirSound Pro - Fones de ouvido premium" 
              className="w-full h-auto rounded-2xl shadow-2xl"
            />
          </div>

          <div className="mt-16 text-center">
            <p className="text-lg font-medium mb-2">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Criado para Inteligência Digital.
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

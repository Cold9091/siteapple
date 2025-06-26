import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/hooks/use-cart";
import CheckoutForm from "@/components/checkout-form";
import type { Product } from "@shared/schema";

export default function ProductGrid() {
  const { data: products, isLoading, error } = useQuery<Product[]>({
    queryKey: ['/api/products/featured'],
  });
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const formatPrice = (priceInCentavos: number) => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA',
    }).format(priceInCentavos / 100);
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    toast({
      title: "Produto adicionado!",
      description: `${product.name} foi adicionado ao seu carrinho.`,
    });
  };

  const handleBuyNow = (product: Product) => {
    addToCart(product);
    setIsCheckoutOpen(true);
  };

  if (error) {
    return (
      <section id="products" className="py-20 lg:py-32 bg-gradient-to-b from-white to-blue-50 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-red-500">Erro ao carregar produtos. Tente novamente mais tarde.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="products" className="py-20 lg:py-32 bg-gradient-to-b from-white to-blue-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-32 left-20 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
      </div>
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h3 className="text-3xl lg:text-4xl font-light apple-text-gray mb-4 tracking-tight">
            Produtos em <span className="font-semibold">destaque</span>
          </h3>
          <p className="text-lg apple-text-medium max-w-2xl mx-auto">
            Uma seleção dos nossos produtos mais populares, cada um projetado para elevar sua experiência digital.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {isLoading ? (
            // Loading skeletons
            Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="group">
                <div className="apple-bg-light rounded-3xl p-8 lg:p-12 mb-6">
                  <Skeleton className="w-full h-64 rounded-2xl" />
                </div>
                <div className="text-center">
                  <Skeleton className="h-6 w-32 mx-auto mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mx-auto mb-6" />
                  <Skeleton className="h-12 w-24 mx-auto rounded-full" />
                </div>
              </div>
            ))
          ) : (
            products?.map((product, index) => (
              <div 
                key={product.id} 
                className={`group cursor-pointer transition-all duration-1000 ${isLoading ? 'opacity-0 translate-y-8' : 'opacity-100 translate-y-0'}`}
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="glass-card rounded-3xl p-8 lg:p-12 mb-6 apple-transition apple-hover float-animation">
                  <img 
                    src={product.imageUrl} 
                    alt={product.name}
                    className="w-full h-64 object-cover object-center rounded-2xl"
                  />
                </div>
                <div className="text-center">
                  <h4 className="text-xl font-semibold apple-text-gray mb-2">
                    {product.name}
                  </h4>
                  <p className="apple-text-medium mb-4 leading-relaxed">
                    {product.description}
                  </p>
                  <p className="text-lg font-semibold apple-text-gray mb-6">
                    {formatPrice(product.price)}
                  </p>
                  <Button
                    onClick={() => handleBuyNow(product)}
                    className="bg-[hsl(207,90%,54%)] hover:bg-[hsl(207,90%,48%)] text-white px-8 py-3 rounded-full font-medium apple-transition hover:shadow-lg hover:scale-105"
                  >
                    Comprar
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <CheckoutForm 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)} 
      />
    </section>
  );
}

import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/hooks/use-cart";
import type { Product } from "@shared/schema";

export default function FeaturedProductsSection() {
  const { data: allProducts, isLoading, error } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });
  const { addToCart } = useCart();
  const { toast } = useToast();

  const formatPrice = (priceInCentavos: number) => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA',
    }).format(priceInCentavos / 100);
  };

  const handlePurchase = (product: Product) => {
    addToCart(product);
    toast({
      title: "Produto adicionado!",
      description: `${product.name} foi adicionado ao seu carrinho.`,
    });
  };

  if (error) {
    return null;
  }

  // Get the first 6 non-featured products for this section
  const featuredProducts = allProducts?.filter(p => !p.featured).slice(0, 6) || [];

  return (
    <section className="py-20 lg:py-32 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h3 className="text-3xl lg:text-4xl font-light apple-text-gray mb-4 tracking-tight">
            Mais <span className="font-semibold">Vendidos</span>
          </h3>
          <p className="text-lg apple-text-medium max-w-2xl mx-auto">
            Descubra os produtos mais procurados pelos nossos clientes em toda Angola.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="relative group">
                <Skeleton className="w-full h-80 rounded-2xl" />
              </div>
            ))
          ) : (
            featuredProducts.map((product, index) => (
              <div 
                key={product.id}
                className={`relative group overflow-hidden rounded-2xl transition-all duration-700 hover:scale-105 cursor-pointer ${
                  index === 0 ? 'md:col-span-2 md:row-span-2 h-96 md:h-full' : 'h-80'
                }`}
                style={{ 
                  animationDelay: `${index * 150}ms`,
                  background: index % 2 === 0 
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                    : index % 3 === 0 
                    ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
                    : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
                }}
              >
                <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                
                <div className="relative z-10 p-8 h-full flex flex-col justify-between text-white">
                  <div>
                    <h4 className={`font-semibold mb-2 ${index === 0 ? 'text-3xl lg:text-4xl' : 'text-xl'}`}>
                      {product.name}
                    </h4>
                    <p className={`mb-4 ${index === 0 ? 'text-lg' : 'text-sm'} text-white/90`}>
                      {product.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`font-bold ${index === 0 ? 'text-2xl' : 'text-lg'}`}>
                        {formatPrice(product.price)}
                      </p>
                    </div>
                    
                    <div className="flex space-x-3">
                      <Button
                        onClick={() => handlePurchase(product)}
                        size={index === 0 ? "default" : "sm"}
                        className="bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm rounded-full"
                      >
                        Comprar
                      </Button>
                      <Button
                        size={index === 0 ? "default" : "sm"}
                        variant="outline"
                        className="border-white/30 text-white hover:bg-white hover:text-gray-900 rounded-full"
                      >
                        Ver mais
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-0 right-0 w-1/2 h-1/2 opacity-30">
                  <img 
                    src={product.imageUrl} 
                    alt={product.name}
                    className="w-full h-full object-cover object-center"
                  />
                </div>

                {index === 0 && (
                  <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                    <span className="text-white text-sm font-medium">Mais Vendido</span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* All Products Grid */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h3 className="text-2xl lg:text-3xl font-light apple-text-gray mb-4 tracking-tight">
              Todos os <span className="font-semibold">Produtos</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {isLoading ? (
              Array.from({ length: 10 }).map((_, index) => (
                <div key={index} className="group">
                  <Skeleton className="w-full h-48 rounded-xl mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-6 w-1/2" />
                </div>
              ))
            ) : (
              allProducts?.map((product, index) => (
                <div 
                  key={product.id}
                  className={`group transition-all duration-700 ${isLoading ? 'opacity-0 translate-y-8' : 'opacity-100 translate-y-0'}`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="glass-card rounded-xl p-4 mb-4 apple-transition hover:shadow-xl hover:scale-105">
                    <img 
                      src={product.imageUrl} 
                      alt={product.name}
                      className="w-full h-48 object-cover object-center rounded-lg"
                    />
                  </div>
                  <div className="text-center">
                    <h4 className="font-semibold apple-text-gray mb-1 text-sm">
                      {product.name}
                    </h4>
                    <p className="text-xs apple-text-medium mb-2 line-clamp-2">
                      {product.description}
                    </p>
                    <p className="font-bold apple-text-gray text-sm mb-3">
                      {formatPrice(product.price)}
                    </p>
                    <Button
                      onClick={() => handlePurchase(product)}
                      size="sm"
                      className="bg-[hsl(207,90%,54%)] hover:bg-[hsl(207,90%,48%)] text-white rounded-full font-medium apple-transition hover:scale-105 w-full"
                    >
                      Comprar
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/hooks/use-cart";
import type { Product } from "@shared/schema";

export default function IPhonePage() {
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

  // Filter iPhone products
  const iPhoneProducts = allProducts?.filter(p => 
    p.category?.toLowerCase() === 'iphone'
  ) || [];

  const iPhoneModels = [
    { name: 'iPhone 16 Pro', description: '' },
    { name: 'iPhone 16', description: '' },
    { name: 'iPhone 16e', description: '' },
    { name: 'iPhone 15', description: '' },
    { name: 'Compare', description: '' },
    { name: 'AirPods', description: '' },
    { name: 'AirTag', description: '' },
    { name: 'Accessories', description: '' },
    { name: 'Apple Card', description: 'Preview' },
    { name: 'iOS 28', description: 'Preview' },
    { name: 'Shop iPhone', description: '' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Navigation Pills */}
      <div className="bg-white border-b border-gray-200 sticky top-12 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center space-x-8 py-4 overflow-x-auto">
            {iPhoneModels.map((model, index) => (
              <div key={index} className="flex flex-col items-center min-w-[80px] group cursor-pointer">
                <div className="w-16 h-20 bg-gray-100 rounded-lg mb-2 flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                  <div className="w-8 h-12 bg-gray-300 rounded-sm"></div>
                </div>
                <span className="text-xs font-medium text-gray-900 text-center leading-tight">
                  {model.name}
                </span>
                <span className="text-xs text-gray-500 text-center">
                  {model.description}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trade-in Banner */}
      <div className="bg-blue-50 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-gray-700">
            Ganhe até 170.000,00 Kz de desconto no iPhone 16 ou iPhone 16 Pro quando trocar seu iPhone 12 ou superior.{' '}
            <a href="#" className="text-blue-600 hover:underline">Saiba mais ›</a>
          </p>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-6xl lg:text-8xl font-light text-gray-900 mb-8 tracking-tight">
            iPhone
          </h1>
          <h2 className="text-3xl lg:text-4xl font-light text-gray-900 mb-12 tracking-tight">
            Designed to be loved.
          </h2>
          
          {/* iPhone Hero Image */}
          <div className="relative max-w-4xl mx-auto">
            <div className="bg-black rounded-3xl p-8 relative overflow-hidden">
              {/* Simulated iPhone screen */}
              <div className="w-80 h-[600px] mx-auto bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 rounded-[3rem] relative">
                <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-full"></div>
                <div className="absolute top-20 left-8 right-8 text-white">
                  <p className="text-sm opacity-80 mb-2">Segunda-feira, 9 de Setembro</p>
                  <p className="text-7xl font-light">9:41</p>
                </div>
              </div>
              
              {/* Floating text */}
              <div className="absolute right-8 top-1/2 transform -translate-y-1/2 text-white">
                <p className="text-lg mb-2">Ativar o Windows</p>
                <p className="text-sm opacity-80">Aceda a Definições para ativar o Windows</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl lg:text-4xl font-light text-gray-900 mb-4 tracking-tight">
              Modelos <span className="font-semibold">iPhone</span>
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Escolha o iPhone perfeito para você. Todos os modelos com tecnologia avançada.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="group">
                  <Skeleton className="w-full h-80 rounded-2xl mb-4" />
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-8 w-1/2" />
                </div>
              ))
            ) : (
              iPhoneProducts?.map((product, index) => (
                <div 
                  key={product.id}
                  className="group bg-white rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <div className="aspect-square bg-gray-50 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
                    <img 
                      src={product.imageUrl} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">
                    {product.name}
                  </h4>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-2xl font-bold text-gray-900">
                      {formatPrice(product.price)}
                    </p>
                    <Button
                      onClick={() => handlePurchase(product)}
                      className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6"
                    >
                      Comprar
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
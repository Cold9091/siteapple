import { ShoppingBag, Search, Settings } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import { useCart } from "@/hooks/use-cart";
import CartSidebar from "@/components/cart-sidebar";
import MegaMenu from "@/components/megamenu";
import SearchOverlay from "@/components/search-overlay";
import SupportMenu from "@/components/support-menu";

export default function Navigation() {
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSupportHovered, setIsSupportHovered] = useState(false);

  const categories = [
    'Store',
    'Mac',
    'iPad',
    'iPhone',
    'Watch',
    'Vision',
    'AirPods',
    'TV & Home',
    'Entertainment',
    'Accessories'
  ];

  const handleCategoryHover = (category: string) => {
    setActiveCategory(category);
    setIsSupportHovered(false);
  };

  const handleCategoryLeave = () => {
    setActiveCategory(null);
  };

  const handleSupportHover = () => {
    setIsSupportHovered(true);
    setActiveCategory(null);
  };

  const handleSupportLeave = () => {
    setIsSupportHovered(false);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 glass-navbar z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12">
            {/* Logo Apple */}
            <div className="flex-shrink-0">
              <Link href="/">
                <div className="w-5 h-5 apple-text-gray cursor-pointer">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                </div>
              </Link>
            </div>

            {/* Menu Central */}
            <div className="hidden md:flex items-center space-x-8">
              {categories.map((category) => (
                category === 'iPhone' ? (
                  <Link key={category} href="/iphone">
                    <button
                      onMouseEnter={() => handleCategoryHover(category)}
                      className="menu-item apple-text-medium hover:apple-text-gray apple-transition text-sm font-normal py-2 focus-micro"
                    >
                      {category}
                    </button>
                  </Link>
                ) : (
                  <button
                    key={category}
                    onMouseEnter={() => handleCategoryHover(category)}
                    className="menu-item apple-text-medium hover:apple-text-gray apple-transition text-sm font-normal py-2 focus-micro"
                  >
                    {category}
                  </button>
                )
              ))}
              <button 
                onMouseEnter={handleSupportHover}
                className="menu-item apple-text-medium hover:apple-text-gray apple-transition text-sm font-normal py-2 focus-micro"
              >
                Suporte
              </button>
            </div>

            {/* Ícones direita */}
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="apple-text-medium hover:apple-text-gray apple-transition icon-micro focus-micro p-2 rounded-full"
              >
                <Search size={18} />
              </button>
              <Link href="/admin">
                <button className="apple-text-medium hover:apple-text-gray apple-transition icon-micro focus-micro p-2 rounded-full">
                  <Settings size={18} />
                </button>
              </Link>
              <CartSidebar>
                <button className="apple-text-medium hover:apple-text-gray apple-transition icon-micro focus-micro relative p-2 rounded-full">
                  <ShoppingBag size={18} />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                      {totalItems}
                    </span>
                  )}
                </button>
              </CartSidebar>
            </div>
          </div>
        </div>
        
        <div onMouseLeave={handleCategoryLeave}>
          <MegaMenu 
            activeCategory={activeCategory}
            onClose={() => setActiveCategory(null)}
          />
        </div>

        <div onMouseLeave={handleSupportLeave}>
          <SupportMenu isVisible={isSupportHovered} />
        </div>
      </nav>

      <SearchOverlay 
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
}

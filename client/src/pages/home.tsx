import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import ProductGrid from "@/components/product-grid";
import FeaturedProductsSection from "@/components/featured-products-section";
import CallToAction from "@/components/call-to-action";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <Navigation />
      <HeroSection />
      <ProductGrid />
      <FeaturedProductsSection />
      <CallToAction />
      <Footer />
    </div>
  );
}

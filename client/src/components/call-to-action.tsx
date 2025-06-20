import { Button } from "@/components/ui/button";

export default function CallToAction() {
  const handleExplore = () => {
    // TODO: Navigate to full product catalog
    console.log('Explore catalog');
  };

  return (
    <section className="py-20 apple-bg-light">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h3 className="text-3xl lg:text-4xl font-light apple-text-gray mb-6 tracking-tight">
          Tecnologia que <span className="font-semibold">inspira</span>
        </h3>
        <p className="text-lg apple-text-medium mb-8 leading-relaxed">
          Cada produto em nossa coleção foi escolhido por sua qualidade excepcional e design inovador. 
          Descubra como a tecnologia pode simplificar e enriquecer seu dia a dia.
        </p>
        <Button
          onClick={handleExplore}
          className="bg-[hsl(210,10%,12%)] hover:bg-[hsl(210,10%,8%)] text-white px-10 py-4 rounded-full font-medium apple-transition hover:shadow-lg hover:scale-105"
        >
          Explorar catálogo completo
        </Button>
      </div>
    </section>
  );
}

export default function Navigation() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-semibold apple-text-gray tracking-tight">
              DigitalPrime
            </h1>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <button
                onClick={() => scrollToSection('products')}
                className="apple-text-medium hover:apple-text-gray apple-transition text-sm font-medium"
              >
                Produtos
              </button>
              <button
                onClick={() => scrollToSection('about')}
                className="apple-text-medium hover:apple-text-gray apple-transition text-sm font-medium"
              >
                Sobre
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="apple-text-medium hover:apple-text-gray apple-transition text-sm font-medium"
              >
                Contato
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

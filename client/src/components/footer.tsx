export default function Footer() {
  const handleLinkClick = (section: string) => {
    // TODO: Implement navigation to respective sections
    console.log('Navigate to:', section);
  };

  return (
    <footer className="py-12 bg-gradient-to-t from-blue-50 to-white border-t border-blue-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h4 className="text-2xl font-semibold apple-text-gray mb-4">
            DigitalPrime
          </h4>
          <p className="apple-text-medium mb-6">
            Elevando sua experiência digital com produtos premium cuidadosamente selecionados.
          </p>
          <div className="flex justify-center space-x-8 text-sm apple-text-medium">
            <button 
              onClick={() => handleLinkClick('privacy')}
              className="hover:apple-text-gray apple-transition"
            >
              Privacidade
            </button>
            <button 
              onClick={() => handleLinkClick('terms')}
              className="hover:apple-text-gray apple-transition"
            >
              Termos
            </button>
            <button 
              onClick={() => handleLinkClick('support')}
              className="hover:apple-text-gray apple-transition"
            >
              Suporte
            </button>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-100">
            <p className="text-sm apple-text-medium">
              © 2024 DigitalPrime. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function TestimonialsSection() {
  const testimonials = [
    {
      id: 1,
      name: "Maria Santos",
      role: "Designer Gráfica",
      location: "Luanda, Angola",
      content: "Os produtos da DigitalPrime revolucionaram minha forma de trabalhar. A qualidade é excepcional e o design é simplesmente perfeito.",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80"
    },
    {
      id: 2,
      name: "João Ferreira",
      role: "Empresário",
      location: "Benguela, Angola",
      content: "Excelente atendimento e produtos de qualidade superior. Recomendo a todos que buscam tecnologia de ponta em Angola.",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80"
    },
    {
      id: 3,
      name: "Ana Costa",
      role: "Estudante Universitária",
      location: "Huambo, Angola",
      content: "Como estudante, encontrei na DigitalPrime os produtos ideais para meus estudos. Qualidade e preço justo combinados perfeitamente.",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80"
    },
    {
      id: 4,
      name: "Carlos Mendes",
      role: "Engenheiro de Software",
      location: "Lobito, Angola",
      content: "A experiência de compra foi incrível. Produtos autênticos, entrega rápida e suporte técnico excepcional. Voltarei sempre!",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80"
    },
    {
      id: 5,
      name: "Isabel Rodrigues",
      role: "Professora",
      location: "Cabinda, Angola",
      content: "Os produtos educacionais da DigitalPrime transformaram minhas aulas. Tecnologia acessível e de qualidade para educação.",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80"
    }
  ];

  return (
    <section className="py-20 lg:py-32 bg-gradient-to-b from-blue-50 to-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-32 left-20 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h3 className="text-3xl lg:text-4xl font-light apple-text-gray mb-4 tracking-tight">
            O que nossos <span className="font-semibold">clientes dizem</span>
          </h3>
          <p className="text-lg apple-text-medium max-w-2xl mx-auto">
            Experiências reais de clientes satisfeitos em toda Angola.
          </p>
        </div>

        {/* Testimonials Carousel */}
        <div className="relative overflow-hidden">
          <div className="flex animate-infinite-scroll space-x-8">
            {/* Duplicamos os depoimentos para criar o efeito infinito */}
            {[...testimonials, ...testimonials].map((testimonial, index) => (
              <div
                key={`${testimonial.id}-${index}`}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:scale-105 min-w-[350px] flex-shrink-0"
              >
                {/* Quote icon */}
                <div className="mb-6">
                  <svg
                    className="w-8 h-8 text-blue-600 opacity-50"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-10zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z" />
                  </svg>
                </div>

                {/* Testimonial content */}
                <p className="text-gray-700 mb-6 leading-relaxed font-light">
                  "{testimonial.content}"
                </p>

                {/* Author info */}
                <div className="flex items-center">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">
                      {testimonial.name}
                    </h4>
                    <p className="text-gray-600 text-sm">
                      {testimonial.role}
                    </p>
                    <p className="text-gray-500 text-xs">
                      {testimonial.location}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
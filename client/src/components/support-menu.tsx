import { MapPin, Phone, Clock, Mail } from 'lucide-react';

interface SupportMenuProps {
  isVisible: boolean;
}

const storeLocations = [
  {
    name: 'DigitalPrime - Luanda Shopping',
    address: 'Rua Rainha Ginga, 188 - Ingombota, Luanda',
    phone: '+244 222 334 567',
    hours: 'Seg-Sáb: 09h-21h | Dom: 14h-19h'
  },
  {
    name: 'DigitalPrime - Belas Shopping',
    address: 'Estrada de Catete, KM 10 - Belas, Luanda',
    phone: '+244 222 445 678',
    hours: 'Seg-Sáb: 09h-21h | Dom: 14h-19h'
  },
  {
    name: 'DigitalPrime - Marginal',
    address: 'Marginal de Luanda, Edifício Presidente - Ingombota, Luanda',
    phone: '+244 222 556 789',
    hours: 'Seg-Sáb: 08h-20h | Dom: 14h-18h'
  }
];

const supportOptions = [
  {
    title: 'Central de Atendimento',
    description: 'Atendimento telefônico 24/7',
    contact: '+244 222 000 123',
    icon: Phone
  },
  {
    title: 'Suporte Técnico',
    description: 'Assistência especializada',
    contact: '+244 222 111 234',
    icon: Phone
  },
  {
    title: 'Email Suporte',
    description: 'Resposta em até 24h',
    contact: 'suporte@digitalprime.ao',
    icon: Mail
  }
];

export default function SupportMenu({ isVisible }: SupportMenuProps) {
  if (!isVisible) return null;

  return (
    <div className="megamenu active">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Support Contacts */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Precisa de Ajuda?</h3>
            <div className="space-y-4">
              {supportOptions.map((option, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <option.icon size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{option.title}</h4>
                    <p className="text-sm text-gray-600 mb-1">{option.description}</p>
                    <a 
                      href={option.contact.includes('@') ? `mailto:${option.contact}` : `tel:${option.contact.replace(/\D/g, '')}`}
                      className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                    >
                      {option.contact}
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Links */}
            <div className="mt-8">
              <h4 className="font-medium text-gray-900 mb-4">Links Úteis</h4>
              <div className="space-y-2">
                <a href="#" className="block text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  FAQ - Perguntas Frequentes
                </a>
                <a href="#" className="block text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Política de Garantia
                </a>
                <a href="#" className="block text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Política de Troca e Devolução
                </a>
                <a href="#" className="block text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Rastreamento de Pedido
                </a>
              </div>
            </div>
          </div>

          {/* Store Locations */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Nossas Lojas</h3>
            <div className="space-y-6">
              {storeLocations.map((store, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                  <div className="flex items-start space-x-3">
                    <MapPin size={20} className="text-blue-600 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-2">{store.name}</h4>
                      <p className="text-sm text-gray-600 mb-3">{store.address}</p>
                      
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Phone size={16} className="text-gray-400" />
                          <a 
                            href={`tel:${store.phone.replace(/\D/g, '')}`}
                            className="text-sm text-blue-600 hover:text-blue-700"
                          >
                            {store.phone}
                          </a>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Clock size={16} className="text-gray-400" />
                          <span className="text-sm text-gray-600">{store.hours}</span>
                        </div>
                      </div>

                      <button className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium">
                        Ver no mapa →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Store Services */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Serviços em Loja</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Assistência técnica especializada</li>
                <li>• Configuração de dispositivos</li>
                <li>• Transferência de dados</li>
                <li>• Troca e devolução</li>
                <li>• Demonstrações de produtos</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const searchSuggestions: Record<string, string[]> = {
  'Suggested Links': [
    'Explore iPhone',
    'Shop iPhone',
    'iPhone 16 Pro and iPhone 16 Pro Max',
    'iPhone 16 and iPhone 16 Plus',
    'iPhone 16e'
  ],
  'Suggested Searches': [
    'iPhone Refurbished',
    'iPhone Adapters',
    'iPhone Cases & Covers',
    'iPhone MagSafe',
    'iPhone TTY Adapters'
  ]
};

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState<Record<string, string[]>>(searchSuggestions);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredSuggestions(searchSuggestions);
      return;
    }

    const filtered: Record<string, string[]> = Object.entries(searchSuggestions).reduce((acc, [category, items]) => {
      const filteredItems = items.filter(item => 
        item.toLowerCase().includes(searchTerm.toLowerCase())
      );
      if (filteredItems.length > 0) {
        acc[category] = filteredItems;
      }
      return acc;
    }, {} as Record<string, string[]>);

    setFilteredSuggestions(filtered);
  }, [searchTerm]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 backdrop-blur-sm">
      <div className="absolute top-0 left-0 right-0 bg-white">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {/* Search Header */}
          <div className="flex items-center space-x-4 mb-8">
            <Search size={24} className="text-gray-400" />
            <Input
              ref={inputRef}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar produtos, categorias..."
              className="flex-1 text-xl border-none shadow-none focus:ring-0 bg-transparent"
            />
            <button 
              onClick={onClose}
              className="icon-micro p-2 hover:bg-gray-100 rounded-full focus-micro"
            >
              <X size={20} />
            </button>
          </div>

          {/* Search Results */}
          <div className="space-y-8">
            {Object.entries(filteredSuggestions).map(([category, items]) => (
              <div key={category}>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
                  {category}
                </h3>
                <div className="space-y-2">
                  {items.map((item, index) => (
                    <button
                      key={index}
                      className="menu-item-micro flex items-center w-full p-3 hover:bg-gray-50 rounded-lg text-left group focus-micro"
                      onClick={() => {
                        // Handle search result click
                        console.log('Search for:', item);
                        onClose();
                      }}
                    >
                      <Search size={16} className="text-gray-400 mr-3 group-hover:text-blue-500" />
                      <span className="text-gray-800 group-hover:text-blue-600">
                        {searchTerm ? (
                          <>
                            {item.substring(0, item.toLowerCase().indexOf(searchTerm.toLowerCase()))}
                            <mark className="bg-yellow-200">{item.substring(item.toLowerCase().indexOf(searchTerm.toLowerCase()), item.toLowerCase().indexOf(searchTerm.toLowerCase()) + searchTerm.length)}</mark>
                            {item.substring(item.toLowerCase().indexOf(searchTerm.toLowerCase()) + searchTerm.length)}
                          </>
                        ) : (
                          item
                        )}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {Object.keys(filteredSuggestions).length === 0 && searchTerm && (
              <div className="text-center py-8">
                <p className="text-gray-500">Nenhum resultado encontrado para "{searchTerm}"</p>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
              Ações Rápidas
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button className="p-4 text-center hover:bg-gray-50 rounded-lg transition-colors">
                <div className="text-2xl mb-2">📱</div>
                <span className="text-sm text-gray-600">Smartphones</span>
              </button>
              <button className="p-4 text-center hover:bg-gray-50 rounded-lg transition-colors">
                <div className="text-2xl mb-2">🎧</div>
                <span className="text-sm text-gray-600">Fones</span>
              </button>
              <button className="p-4 text-center hover:bg-gray-50 rounded-lg transition-colors">
                <div className="text-2xl mb-2">⌚</div>
                <span className="text-sm text-gray-600">Smartwatches</span>
              </button>
              <button className="p-4 text-center hover:bg-gray-50 rounded-lg transition-colors">
                <div className="text-2xl mb-2">💻</div>
                <span className="text-sm text-gray-600">Computadores</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
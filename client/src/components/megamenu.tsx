import { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { Category, Subcategory } from '@shared/schema';

interface MegaMenuData {
  [key: string]: {
    sections: {
      title: string;
      items: string[];
    }[];
  };
}

// Fallback data for when categories are loading
const fallbackMegaMenuData: MegaMenuData = {
  'iPhone': {
    sections: [
      {
        title: 'Explore iPhone',
        items: [
          'Explore All iPhone',
          'iPhone 16 Pro',
          'iPhone 16',
          'iPhone 16e',
          'iPhone 15',
          'Compare iPhone',
          'Switch from Android'
        ]
      },
      {
        title: 'Shop iPhone',
        items: [
          'Shop iPhone',
          'iPhone Accessories',
          'Apple Trade In',
          'Carrier Deals at Apple',
          'Financing'
        ]
      },
      {
        title: 'More from iPhone',
        items: [
          'iPhone Support',
          'AppleCare+ for iPhone',
          'iOS 26 Preview',
          'Apple Intelligence',
          'Apps by Apple',
          'iPhone Privacy',
          'iCloud+',
          'Wallet, Pay, Card',
          'Siri'
        ]
      }
    ]
  },
  'Samsung': {
    sections: [
      {
        title: 'Explore Samsung',
        items: [
          'Galaxy S24 Series',
          'Galaxy Note Series',
          'Galaxy A Series',
          'Galaxy Z Fold',
          'Galaxy Z Flip',
          'Compare Samsung',
          'Trade-in Program'
        ]
      },
      {
        title: 'Shop Samsung',
        items: [
          'Shop Samsung',
          'Samsung Accessories',
          'Samsung Cases',
          'Wireless Chargers',
          'Galaxy Buds'
        ]
      },
      {
        title: 'Samsung Services',
        items: [
          'Samsung Support',
          'Samsung Care+',
          'One UI Updates',
          'Samsung Pay',
          'Galaxy Store',
          'Samsung Cloud',
          'Bixby Assistant'
        ]
      }
    ]
  },
  'Computadores': {
    sections: [
      {
        title: 'Laptops',
        items: [
          'MacBook Air',
          'MacBook Pro',
          'Dell XPS',
          'Lenovo ThinkPad',
          'ASUS ZenBook',
          'HP Spectre',
          'Gaming Laptops'
        ]
      },
      {
        title: 'Desktops',
        items: [
          'iMac',
          'Mac Studio',
          'Gaming PCs',
          'All-in-One',
          'Mini PCs',
          'Workstations'
        ]
      },
      {
        title: 'Acessórios',
        items: [
          'Monitors',
          'Keyboards',
          'Mice',
          'Webcams',
          'Docking Stations',
          'Computer Support'
        ]
      }
    ]
  },
  'Jogos': {
    sections: [
      {
        title: 'Consoles',
        items: [
          'PlayStation 5',
          'Xbox Series X|S',
          'Nintendo Switch',
          'Steam Deck',
          'Retro Consoles',
          'VR Headsets'
        ]
      },
      {
        title: 'Gaming Gear',
        items: [
          'Gaming Headsets',
          'Gaming Keyboards',
          'Gaming Mice',
          'Controllers',
          'Gaming Chairs',
          'Streaming Equipment'
        ]
      },
      {
        title: 'Gaming Services',
        items: [
          'Game Pass',
          'PlayStation Plus',
          'Nintendo Online',
          'Cloud Gaming',
          'Gaming Support'
        ]
      }
    ]
  },
  'Fones': {
    sections: [
      {
        title: 'Fones Premium',
        items: [
          'AirPods Pro',
          'AirPods Max',
          'Sony WH-1000XM5',
          'Bose QuietComfort',
          'Sennheiser Momentum'
        ]
      },
      {
        title: 'Fones Esportivos',
        items: [
          'AirPods (3ª geração)',
          'Beats Fit Pro',
          'Jabra Elite Sport',
          'Powerbeats Pro'
        ]
      },
      {
        title: 'Acessórios',
        items: [
          'Cases para Fones',
          'Adaptadores',
          'Suporte Técnico'
        ]
      }
    ]
  },
  'Smartwatches': {
    sections: [
      {
        title: 'Apple Watch',
        items: [
          'Apple Watch Series 9',
          'Apple Watch Ultra 2',
          'Apple Watch SE',
          'Apple Watch Studio',
          'Compare Watch'
        ]
      },
      {
        title: 'Outras Marcas',
        items: [
          'Samsung Galaxy Watch',
          'Garmin',
          'Fitbit',
          'Amazfit',
          'Huawei Watch'
        ]
      },
      {
        title: 'Acessórios',
        items: [
          'Pulseiras',
          'Carregadores',
          'Cases Protetores',
          'Suporte Smartwatch'
        ]
      }
    ]
  }
};

interface MegaMenuProps {
  activeCategory: string | null;
  onClose: () => void;
}

export default function MegaMenu({ activeCategory, onClose }: MegaMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  // Fetch categories with subcategories from API
  const { data: categoriesWithSubs = [] } = useQuery<(Category & { subcategories: Subcategory[] })[]>({
    queryKey: ['/api/categories/with-subcategories'],
  });

  // Build dynamic menu data from database categories
  const buildMegaMenuData = (): MegaMenuData => {
    const menuData: MegaMenuData = {};
    
    categoriesWithSubs.forEach(category => {
      if (!category.isActive) return;
      
      const sections = [];
      
      // Add main section with category exploration
      sections.push({
        title: `Explore ${category.name}`,
        items: [
          `Explore All ${category.name}`,
          ...category.subcategories
            .filter(sub => sub.isActive)
            .slice(0, 4)
            .map(sub => sub.name)
        ]
      });

      // Add shop section
      sections.push({
        title: `Shop ${category.name}`,
        items: [
          `Shop ${category.name}`,
          `${category.name} Accessories`,
          'Apple Trade In',
          'Financing'
        ]
      });

      // Add support section
      sections.push({
        title: `More from ${category.name}`,
        items: [
          `${category.name} Support`,
          `AppleCare+ for ${category.name}`,
          'Customer Service',
          'Warranty'
        ]
      });

      menuData[category.name] = { sections };
    });

    return menuData;
  };

  const megaMenuData = categoriesWithSubs.length > 0 ? buildMegaMenuData() : fallbackMegaMenuData;
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (activeCategory) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeCategory, onClose]);

  if (!activeCategory || !megaMenuData[activeCategory]) {
    return null;
  }

  const menuData = megaMenuData[activeCategory];

  return (
    <div 
      ref={menuRef}
      className={`megamenu ${activeCategory ? 'active' : ''}`}
    >
      <div className="megamenu-content">
        {menuData.sections.map((section, index) => (
          <div key={index} className="megamenu-section">
            <h3>{section.title}</h3>
            <ul>
              {section.items.map((item, itemIndex) => (
                <li key={itemIndex}>
                  <a href="#" onClick={(e) => e.preventDefault()} className="menu-item-micro">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
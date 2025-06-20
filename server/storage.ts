import { users, products, type User, type InsertUser, type Product, type InsertProduct } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getProducts(): Promise<Product[]>;
  getFeaturedProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private products: Map<number, Product>;
  private currentUserId: number;
  private currentProductId: number;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.currentUserId = 1;
    this.currentProductId = 1;
    
    // Initialize with sample products
    this.initializeProducts();
  }

  private initializeProducts() {
    const sampleProducts: InsertProduct[] = [
      {
        name: "AirSound Pro",
        description: "Fones de ouvido wireless com cancelamento de ruído ativo e qualidade de áudio excepcional.",
        price: 24825000, // 248.250 AOA
        imageUrl: "https://images.unsplash.com/photo-1484704849700-f032a568e944?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        category: "headphones",
        featured: true,
      },
      {
        name: "ChargeFast Station",
        description: "Estação de carregamento inteligente com tecnologia de carregamento rápido para múltiplos dispositivos.",
        price: 10725000, // 107.250 AOA
        imageUrl: "https://images.unsplash.com/photo-1583394838336-acd977736f90?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        category: "chargers",
        featured: true,
      },
      {
        name: "TimeSync Elite",
        description: "Smartwatch avançado com monitoramento de saúde, GPS integrado e design premium em titânio.",
        price: 41500000, // 415.000 AOA
        imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        category: "smartwatches",
        featured: true,
      },
      {
        name: "iPhone 16 Pro",
        description: "O iPhone mais avançado de sempre com chip A18 Pro e câmara revolucionária.",
        price: 83000000, // 830.000 AOA
        imageUrl: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        category: "smartphones",
        featured: false,
      },
      {
        name: "Samsung Galaxy S24 Ultra",
        description: "Smartphone premium com S Pen integrada e câmara de 200MP.",
        price: 79500000, // 795.000 AOA
        imageUrl: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        category: "smartphones",
        featured: false,
      },
      {
        name: "MacBook Pro M3",
        description: "Laptop profissional com chip M3 e ecrã Liquid Retina XDR de 14 polegadas.",
        price: 166000000, // 1.660.000 AOA
        imageUrl: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        category: "computers",
        featured: false,
      },
      {
        name: "AirPods Pro 2",
        description: "Fones true wireless com cancelamento de ruído adaptativo e áudio espacial.",
        price: 16600000, // 166.000 AOA
        imageUrl: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        category: "headphones",
        featured: false,
      },
      {
        name: "iPad Pro 12.9",
        description: "Tablet profissional com chip M2 e ecrã Liquid Retina XDR de 12.9 polegadas.",
        price: 91500000, // 915.000 AOA
        imageUrl: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        category: "tablets",
        featured: false,
      },
      {
        name: "PlayStation 5",
        description: "Console de jogos de nova geração com SSD ultrarrápido e ray tracing.",
        price: 58000000, // 580.000 AOA
        imageUrl: "https://images.unsplash.com/photo-1607853202273-797f1c22a38e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        category: "gaming",
        featured: false,
      },
      {
        name: "Dell XPS 13",
        description: "Ultrabook premium com processador Intel Core i7 e ecrã InfinityEdge.",
        price: 124500000, // 1.245.000 AOA
        imageUrl: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        category: "computers",
        featured: false,
      },
      {
        name: "Apple Watch Series 9",
        description: "Smartwatch com ecrã Always-On e monitorização avançada de saúde.",
        price: 33200000, // 332.000 AOA
        imageUrl: "https://images.unsplash.com/photo-1551816230-ef5deaed4a26?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        category: "smartwatches",
        featured: false,
      },
      {
        name: "Sony WH-1000XM5",
        description: "Fones over-ear com cancelamento de ruído líder na indústria.",
        price: 24900000, // 249.000 AOA
        imageUrl: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        category: "headphones",
        featured: false,
      },
      {
        name: "Nintendo Switch OLED",
        description: "Console híbrido com ecrã OLED vibrante de 7 polegadas.",
        price: 29100000, // 291.000 AOA
        imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        category: "gaming",
        featured: false,
      }
    ];

    sampleProducts.forEach(product => {
      const id = this.currentProductId++;
      const fullProduct: Product = { ...product, id, featured: product.featured ?? false };
      this.products.set(id, fullProduct);
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getFeaturedProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(product => product.featured);
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.currentProductId++;
    const product: Product = { ...insertProduct, id, featured: insertProduct.featured ?? false };
    this.products.set(id, product);
    return product;
  }
}

export const storage = new MemStorage();

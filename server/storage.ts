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
        price: 29900, // $299.00
        imageUrl: "https://images.unsplash.com/photo-1484704849700-f032a568e944?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        category: "headphones",
        featured: true,
      },
      {
        name: "ChargeFast Station",
        description: "Estação de carregamento inteligente com tecnologia de carregamento rápido para múltiplos dispositivos.",
        price: 12900, // $129.00
        imageUrl: "https://images.unsplash.com/photo-1583394838336-acd977736f90?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        category: "chargers",
        featured: true,
      },
      {
        name: "TimeSync Elite",
        description: "Smartwatch avançado com monitoramento de saúde, GPS integrado e design premium em titânio.",
        price: 49900, // $499.00
        imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        category: "smartwatches",
        featured: true,
      },
    ];

    sampleProducts.forEach(product => {
      const id = this.currentProductId++;
      const fullProduct: Product = { ...product, id };
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
    const product: Product = { ...insertProduct, id };
    this.products.set(id, product);
    return product;
  }
}

export const storage = new MemStorage();

import { users, products, orders, type User, type InsertUser, type Product, type InsertProduct, type Order, type InsertOrder } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getProducts(): Promise<Product[]>;
  getFeaturedProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: InsertProduct): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;
  getOrders(): Promise<Order[]>;
  getOrder(id: number): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: number, status: string): Promise<Order | undefined>;
  getDashboardStats(): Promise<{
    totalProducts: number;
    totalOrders: number;
    pendingOrders: number;
    totalRevenue: number;
    recentOrders: Order[];
  }>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private products: Map<number, Product>;
  private orders: Map<number, Order>;
  private currentUserId: number;
  private currentProductId: number;
  private currentOrderId: number;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.orders = new Map();
    this.currentUserId = 1;
    this.currentProductId = 1;
    this.currentOrderId = 1;
    
    // Initialize with sample data
    this.initializeProducts();
    this.initializeOrders();
  }

  private initializeProducts() {
    const sampleProducts: any[] = [
      {
        name: "AirSound Pro",
        description: "Fones de ouvido wireless com cancelamento de ruído ativo e qualidade de áudio excepcional.",
        price: 24825000, // 248.250 AOA
        imageUrl: "https://images.unsplash.com/photo-1484704849700-f032a568e944?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        category: "Fones",
        featured: true,
      },
      {
        name: "ChargeFast Station",
        description: "Estação de carregamento inteligente com tecnologia de carregamento rápido para múltiplos dispositivos.",
        price: 10725000, // 107.250 AOA
        imageUrl: "https://images.unsplash.com/photo-1583394838336-acd977736f90?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        category: "Carregadores",
        featured: true,
      },
      {
        name: "TimeSync Elite",
        description: "Smartwatch avançado com monitoramento de saúde, GPS integrado e design premium em titânio.",
        price: 41500000, // 415.000 AOA
        imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        category: "Relógios",
        featured: true,
      },
      {
        name: "iPhone 16 Pro",
        description: "O iPhone mais avançado já criado. Com chip A18 Pro, sistema de câmera Pro e design em titânio.",
        price: 132490000, // 1.324.900 AOA
        imageUrl: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        category: "iPhone",
        featured: true,
      },
      {
        name: "iPhone 16",
        description: "Potente, bonito e construído para durar. Com chip A18 e novas funcionalidades de câmera.",
        price: 99900000, // 999.000 AOA
        imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        category: "iPhone",
        featured: true,
      },
      {
        name: "iPhone 15",
        description: "iPhone com Dynamic Island, câmera Principal de 48 MP e USB-C.",
        price: 82990000, // 829.900 AOA
        imageUrl: "https://images.unsplash.com/photo-1556656793-08538906a9f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        category: "iPhone",
        featured: false,
      },
      {
        name: "iPhone 14",
        description: "iPhone com sistema de câmera dupla avançado e recursos de segurança inovadores.",
        price: 66490000, // 664.900 AOA
        imageUrl: "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        category: "iPhone",
        featured: false,
      },
      {
        name: "AirPods Pro 2",
        description: "Fones true wireless com cancelamento de ruído adaptativo e áudio espacial.",
        price: 16600000, // 166.000 AOA
        imageUrl: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        category: "Fones",
        featured: false,
      },
      {
        name: "Sony WH-1000XM5",
        description: "Fones over-ear com cancelamento de ruído líder na indústria.",
        price: 24900000, // 249.000 AOA
        imageUrl: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        category: "Fones",
        featured: false,
      },
      {
        name: "Apple Watch Series 9",
        description: "Smartwatch com ecrã Always-On e monitorização avançada de saúde.",
        price: 33200000, // 332.000 AOA
        imageUrl: "https://images.unsplash.com/photo-1551816230-ef5deaed4a26?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        category: "Relógios",
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

  async updateProduct(id: number, insertProduct: InsertProduct): Promise<Product | undefined> {
    const existingProduct = this.products.get(id);
    if (!existingProduct) {
      return undefined;
    }
    const updatedProduct: Product = { ...insertProduct, id, featured: insertProduct.featured ?? false };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<boolean> {
    return this.products.delete(id);
  }

  private initializeOrders() {
    const sampleOrders: InsertOrder[] = [
      {
        customerName: "João Silva",
        customerEmail: "joao.silva@email.com",
        customerPhone: "+244 923 456 789",
        items: [
          { productId: 1, quantity: 1, price: 24825000, name: "AirSound Pro" }
        ],
        totalAmount: 24825000,
        status: "delivered",
        shippingAddress: "Rua da Missão, 123, Luanda, Angola"
      },
      {
        customerName: "Maria Santos",
        customerEmail: "maria.santos@email.com",
        customerPhone: "+244 912 345 678",
        items: [
          { productId: 2, quantity: 1, price: 10725000, name: "ChargeFast Station" },
          { productId: 4, quantity: 1, price: 16600000, name: "AirPods Pro 2" }
        ],
        totalAmount: 27325000,
        status: "processing",
        shippingAddress: "Av. Talatona, 456, Luanda, Angola"
      },
      {
        customerName: "Carlos Mendes",
        customerEmail: "carlos.mendes@email.com",
        customerPhone: "+244 934 567 890",
        items: [
          { productId: 3, quantity: 1, price: 41500000, name: "TimeSync Elite" }
        ],
        totalAmount: 41500000,
        status: "pending",
        shippingAddress: "Rua Amílcar Cabral, 789, Benguela, Angola"
      }
    ];

    sampleOrders.forEach(order => {
      const id = this.currentOrderId++;
      const fullOrder: Order = { 
        ...order, 
        id,
        customerPhone: order.customerPhone || null,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.orders.set(id, fullOrder);
    });
  }

  async getOrders(): Promise<Order[]> {
    return Array.from(this.orders.values()).sort((a, b) => 
      new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
  }

  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = this.currentOrderId++;
    const order: Order = { 
      ...insertOrder, 
      id,
      customerPhone: insertOrder.customerPhone || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.orders.set(id, order);
    return order;
  }

  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const existingOrder = this.orders.get(id);
    if (!existingOrder) {
      return undefined;
    }
    const updatedOrder: Order = { 
      ...existingOrder, 
      status,
      updatedAt: new Date()
    };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }

  async getDashboardStats(): Promise<{
    totalProducts: number;
    totalOrders: number;
    pendingOrders: number;
    totalRevenue: number;
    recentOrders: Order[];
  }> {
    const allOrders = Array.from(this.orders.values());
    const totalProducts = this.products.size;
    const totalOrders = allOrders.length;
    const pendingOrders = allOrders.filter(order => order.status === "pending").length;
    const totalRevenue = allOrders
      .filter(order => order.status === "delivered")
      .reduce((sum, order) => sum + order.totalAmount, 0);
    const recentOrders = allOrders
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
      .slice(0, 5);

    return {
      totalProducts,
      totalOrders,
      pendingOrders,
      totalRevenue,
      recentOrders
    };
  }
}

export const storage = new MemStorage();

import { users, products, orders, categories, subcategories, type User, type InsertUser, type Product, type InsertProduct, type Order, type InsertOrder, type Category, type InsertCategory, type Subcategory, type InsertSubcategory } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

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
  getCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, category: InsertCategory): Promise<Category | undefined>;
  deleteCategory(id: number): Promise<boolean>;
  getSubcategories(): Promise<Subcategory[]>;
  getSubcategoriesByCategory(categoryId: number): Promise<Subcategory[]>;
  getSubcategory(id: number): Promise<Subcategory | undefined>;
  createSubcategory(subcategory: InsertSubcategory): Promise<Subcategory>;
  updateSubcategory(id: number, subcategory: InsertSubcategory): Promise<Subcategory | undefined>;
  deleteSubcategory(id: number): Promise<boolean>;
  getCategoriesWithSubcategories(): Promise<(Category & { subcategories: Subcategory[] })[]>;
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
    const sampleOrders = [
      {
        customerName: "João Silva",
        customerEmail: "joao.silva@email.com",
        customerPhone: "+244 923 456 789",
        items: '[{"productId":1,"quantity":1,"price":24825000,"name":"AirSound Pro"}]',
        totalAmount: 24825000,
        status: "delivered" as const,
        shippingAddress: "Rua da Missão, 123, Luanda, Angola"
      },
      {
        customerName: "Maria Santos",
        customerEmail: "maria.santos@email.com",
        customerPhone: "+244 912 345 678",
        items: '[{"productId":2,"quantity":1,"price":10725000,"name":"ChargeFast Station"},{"productId":4,"quantity":1,"price":16600000,"name":"AirPods Pro 2"}]',
        totalAmount: 27325000,
        status: "processing" as const,
        shippingAddress: "Av. Talatona, 456, Luanda, Angola"
      },
      {
        customerName: "Carlos Mendes",
        customerEmail: "carlos.mendes@email.com",
        customerPhone: "+244 934 567 890",
        items: '[{"productId":3,"quantity":1,"price":41500000,"name":"TimeSync Elite"}]',
        totalAmount: 41500000,
        status: "pending" as const,
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

  async getCategories(): Promise<Category[]> {
    return [];
  }

  async getCategory(id: number): Promise<Category | undefined> {
    return undefined;
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    throw new Error("MemStorage does not support categories");
  }

  async updateCategory(id: number, category: InsertCategory): Promise<Category | undefined> {
    return undefined;
  }

  async deleteCategory(id: number): Promise<boolean> {
    return false;
  }

  async getSubcategories(): Promise<Subcategory[]> {
    return [];
  }

  async getSubcategoriesByCategory(categoryId: number): Promise<Subcategory[]> {
    return [];
  }

  async getSubcategory(id: number): Promise<Subcategory | undefined> {
    return undefined;
  }

  async createSubcategory(subcategory: InsertSubcategory): Promise<Subcategory> {
    throw new Error("MemStorage does not support subcategories");
  }

  async updateSubcategory(id: number, subcategory: InsertSubcategory): Promise<Subcategory | undefined> {
    return undefined;
  }

  async deleteSubcategory(id: number): Promise<boolean> {
    return false;
  }

  async getCategoriesWithSubcategories(): Promise<(Category & { subcategories: Subcategory[] })[]> {
    return [];
  }
}

export class SQLiteStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async getProducts(): Promise<Product[]> {
    return await db.select().from(products);
  }

  async getFeaturedProducts(): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.featured, true));
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const result = await db.select().from(products).where(eq(products.id, id)).limit(1);
    return result[0];
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const result = await db.insert(products).values(insertProduct).returning();
    return result[0];
  }

  async updateProduct(id: number, insertProduct: InsertProduct): Promise<Product | undefined> {
    const result = await db.update(products).set(insertProduct).where(eq(products.id, id)).returning();
    return result[0];
  }

  async deleteProduct(id: number): Promise<boolean> {
    const result = await db.delete(products).where(eq(products.id, id));
    return result.changes > 0;
  }

  async getOrders(): Promise<Order[]> {
    return await db.select().from(orders);
  }

  async getOrder(id: number): Promise<Order | undefined> {
    const result = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
    return result[0];
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const orderData = {
      ...insertOrder,
      items: typeof insertOrder.items === 'string' ? insertOrder.items : JSON.stringify(insertOrder.items)
    };
    const result = await db.insert(orders).values(orderData).returning();
    return result[0];
  }

  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const result = await db.update(orders).set({ 
      status, 
      updatedAt: new Date() 
    }).where(eq(orders.id, id)).returning();
    return result[0];
  }

  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories).orderBy(categories.sortOrder);
  }

  async getCategory(id: number): Promise<Category | undefined> {
    const result = await db.select().from(categories).where(eq(categories.id, id)).limit(1);
    return result[0];
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const result = await db.insert(categories).values(insertCategory).returning();
    return result[0];
  }

  async updateCategory(id: number, insertCategory: InsertCategory): Promise<Category | undefined> {
    const result = await db.update(categories).set({
      ...insertCategory,
      updatedAt: new Date()
    }).where(eq(categories.id, id)).returning();
    return result[0];
  }

  async deleteCategory(id: number): Promise<boolean> {
    const result = await db.delete(categories).where(eq(categories.id, id));
    return result.changes > 0;
  }

  async getSubcategories(): Promise<Subcategory[]> {
    return await db.select().from(subcategories).orderBy(subcategories.sortOrder);
  }

  async getSubcategoriesByCategory(categoryId: number): Promise<Subcategory[]> {
    return await db.select().from(subcategories).where(eq(subcategories.categoryId, categoryId)).orderBy(subcategories.sortOrder);
  }

  async getSubcategory(id: number): Promise<Subcategory | undefined> {
    const result = await db.select().from(subcategories).where(eq(subcategories.id, id)).limit(1);
    return result[0];
  }

  async createSubcategory(insertSubcategory: InsertSubcategory): Promise<Subcategory> {
    const result = await db.insert(subcategories).values(insertSubcategory).returning();
    return result[0];
  }

  async updateSubcategory(id: number, insertSubcategory: InsertSubcategory): Promise<Subcategory | undefined> {
    const result = await db.update(subcategories).set({
      ...insertSubcategory,
      updatedAt: new Date()
    }).where(eq(subcategories.id, id)).returning();
    return result[0];
  }

  async deleteSubcategory(id: number): Promise<boolean> {
    const result = await db.delete(subcategories).where(eq(subcategories.id, id));
    return result.changes > 0;
  }

  async getCategoriesWithSubcategories(): Promise<(Category & { subcategories: Subcategory[] })[]> {
    const allCategories = await this.getCategories();
    const allSubcategories = await this.getSubcategories();
    
    return allCategories.map(category => ({
      ...category,
      subcategories: allSubcategories.filter(sub => sub.categoryId === category.id)
    }));
  }

  async getDashboardStats(): Promise<{
    totalProducts: number;
    totalOrders: number;
    pendingOrders: number;
    totalRevenue: number;
    recentOrders: Order[];
  }> {
    const allProducts = await this.getProducts();
    const allOrders = await this.getOrders();
    
    const pendingOrders = allOrders.filter(order => order.status === 'pending').length;
    const totalRevenue = allOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    const recentOrders = allOrders.slice(-5);

    return {
      totalProducts: allProducts.length,
      totalOrders: allOrders.length,
      pendingOrders,
      totalRevenue,
      recentOrders,
    };
  }
}

export class SQLiteStorageWithInit extends SQLiteStorage {
  private initialized = false;

  async ensureInitialized() {
    if (this.initialized) return;
    
    // Check if we have products already (direct DB call to avoid recursion)
    const existingProducts = await db.select().from(products);
    
    if (existingProducts.length === 0) {
      // Add sample products
      // Get created categories to link products
      const allCategories = await db.select().from(categories);
      const iphoneCategory = allCategories.find(c => c.slug === "iphone");
      const macCategory = allCategories.find(c => c.slug === "mac");
      const airpodsCategory = allCategories.find(c => c.slug === "airpods");
      const acessoriosCategory = allCategories.find(c => c.slug === "acessorios");

      const sampleProducts = [
        {
          name: "AirSound Pro",
          description: "Fones de ouvido sem fio premium com cancelamento de ruído avançado e qualidade de som excepcional.",
          price: 75000, // 750 AOA
          imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop",
          categoryId: airpodsCategory?.id || null,
          subcategoryId: null,
          featured: true,
        },
        {
          name: "iPhone 15 Pro",
          description: "O mais avançado iPhone com chip A17 Pro, sistema de câmera Pro e design em titânio.",
          price: 500000, // 5000 AOA
          imageUrl: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&h=500&fit=crop",
          categoryId: iphoneCategory?.id || null,
          subcategoryId: null,
          featured: true,
        },
        {
          name: "PowerCharge Pro",
          description: "Carregador sem fio rápido compatível com todos os dispositivos Apple. Design elegante e eficiente.",
          price: 25000, // 250 AOA
          imageUrl: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=500&h=500&fit=crop",
          categoryId: acessoriosCategory?.id || null,
          subcategoryId: null,
          featured: false,
        },
        {
          name: "MacBook Pro 16\"",
          description: "Performance excepcional com chip M3 Pro, display Liquid Retina XDR e bateria para o dia todo.",
          price: 1200000, // 12000 AOA
          imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=500&fit=crop",
          categoryId: macCategory?.id || null,
          subcategoryId: null,
          featured: true,
        },
      ];

      for (const product of sampleProducts) {
        await this.createProduct(product);
      }
    }

    // Check if we have categories already
    const existingCategories = await db.select().from(categories);
    
    if (existingCategories.length === 0) {
      // Add sample categories and subcategories
      const sampleCategories = [
        {
          name: "iPhone",
          slug: "iphone",
          description: "Smartphones e acessórios iPhone",
          isActive: true,
          sortOrder: 1,
        },
        {
          name: "Mac",
          slug: "mac",
          description: "Computadores e laptops Mac",
          isActive: true,
          sortOrder: 2,
        },
        {
          name: "iPad",
          slug: "ipad",
          description: "Tablets iPad e acessórios",
          isActive: true,
          sortOrder: 3,
        },
        {
          name: "Watch",
          slug: "watch",
          description: "Apple Watch e acessórios",
          isActive: true,
          sortOrder: 4,
        },
        {
          name: "AirPods",
          slug: "airpods",
          description: "Fones de ouvido sem fio",
          isActive: true,
          sortOrder: 5,
        },
        {
          name: "Acessórios",
          slug: "acessorios",
          description: "Acessórios diversos",
          isActive: true,
          sortOrder: 6,
        },
      ];

      for (const category of sampleCategories) {
        const createdCategory = await this.createCategory(category);
        
        // Add subcategories for each category
        let subcategories: any[] = [];
        
        switch (category.slug) {
          case "iphone":
            subcategories = [
              { name: "iPhone 15", slug: "iphone-15", categoryId: createdCategory.id, sortOrder: 1 },
              { name: "iPhone 14", slug: "iphone-14", categoryId: createdCategory.id, sortOrder: 2 },
              { name: "iPhone 13", slug: "iphone-13", categoryId: createdCategory.id, sortOrder: 3 },
              { name: "Capas", slug: "capas-iphone", categoryId: createdCategory.id, sortOrder: 4 },
            ];
            break;
          case "mac":
            subcategories = [
              { name: "MacBook Air", slug: "macbook-air", categoryId: createdCategory.id, sortOrder: 1 },
              { name: "MacBook Pro", slug: "macbook-pro", categoryId: createdCategory.id, sortOrder: 2 },
              { name: "iMac", slug: "imac", categoryId: createdCategory.id, sortOrder: 3 },
              { name: "Mac mini", slug: "mac-mini", categoryId: createdCategory.id, sortOrder: 4 },
            ];
            break;
          case "ipad":
            subcategories = [
              { name: "iPad Pro", slug: "ipad-pro", categoryId: createdCategory.id, sortOrder: 1 },
              { name: "iPad Air", slug: "ipad-air", categoryId: createdCategory.id, sortOrder: 2 },
              { name: "iPad", slug: "ipad-standard", categoryId: createdCategory.id, sortOrder: 3 },
              { name: "iPad mini", slug: "ipad-mini", categoryId: createdCategory.id, sortOrder: 4 },
            ];
            break;
          case "watch":
            subcategories = [
              { name: "Apple Watch Series 9", slug: "watch-series-9", categoryId: createdCategory.id, sortOrder: 1 },
              { name: "Apple Watch SE", slug: "watch-se", categoryId: createdCategory.id, sortOrder: 2 },
              { name: "Pulseiras", slug: "pulseiras", categoryId: createdCategory.id, sortOrder: 3 },
            ];
            break;
          case "airpods":
            subcategories = [
              { name: "AirPods Pro", slug: "airpods-pro", categoryId: createdCategory.id, sortOrder: 1 },
              { name: "AirPods (3ª geração)", slug: "airpods-3", categoryId: createdCategory.id, sortOrder: 2 },
              { name: "AirPods Max", slug: "airpods-max", categoryId: createdCategory.id, sortOrder: 3 },
            ];
            break;
          case "acessorios":
            subcategories = [
              { name: "Carregadores", slug: "carregadores", categoryId: createdCategory.id, sortOrder: 1 },
              { name: "Cabos", slug: "cabos", categoryId: createdCategory.id, sortOrder: 2 },
              { name: "Suportes", slug: "suportes", categoryId: createdCategory.id, sortOrder: 3 },
              { name: "Outros", slug: "outros", categoryId: createdCategory.id, sortOrder: 4 },
            ];
            break;
        }

        for (const subcategory of subcategories) {
          await this.createSubcategory({
            ...subcategory,
            description: "",
            isActive: true,
          });
        }
      }
    }

    this.initialized = true;
  }

  async getProducts(): Promise<Product[]> {
    await this.ensureInitialized();
    return await db.select().from(products);
  }

  async getFeaturedProducts(): Promise<Product[]> {
    await this.ensureInitialized();
    return super.getFeaturedProducts();
  }
}

export const storage = new SQLiteStorageWithInit();

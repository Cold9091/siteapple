import {
  users,
  products,
  orders,
  categories,
  subcategories,
  type User,
  type UpsertUser,
  type Product,
  type InsertProduct,
  type Order,
  type InsertOrder,
  type Category,
  type InsertCategory,
  type Subcategory,
  type InsertSubcategory,
  type OrderItem,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations for Replit Auth
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Product operations
  getProducts(): Promise<Product[]>;
  getFeaturedProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: InsertProduct): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;
  
  // Order operations
  getOrders(): Promise<Order[]>;
  getOrder(id: number): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: number, status: string): Promise<Order | undefined>;
  
  // Category operations
  getCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, category: InsertCategory): Promise<Category | undefined>;
  deleteCategory(id: number): Promise<boolean>;
  
  // Subcategory operations
  getSubcategories(): Promise<Subcategory[]>;
  getSubcategoriesByCategory(categoryId: number): Promise<Subcategory[]>;
  getSubcategory(id: number): Promise<Subcategory | undefined>;
  createSubcategory(subcategory: InsertSubcategory): Promise<Subcategory>;
  updateSubcategory(id: number, subcategory: InsertSubcategory): Promise<Subcategory | undefined>;
  deleteSubcategory(id: number): Promise<boolean>;
  
  // Combined operations
  getCategoriesWithSubcategories(): Promise<(Category & { subcategories: Subcategory[] })[]>;
  getDashboardStats(): Promise<{
    totalProducts: number;
    totalOrders: number;
    pendingOrders: number;
    totalRevenue: number;
    recentOrders: Order[];
  }>;
}

export class DatabaseStorage implements IStorage {
  // User operations for Replit Auth
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Product operations
  async getProducts(): Promise<Product[]> {
    return await db.select().from(products);
  }

  async getFeaturedProducts(): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.featured, true));
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const [product] = await db
      .insert(products)
      .values(insertProduct)
      .returning();
    return product;
  }

  async updateProduct(id: number, insertProduct: InsertProduct): Promise<Product | undefined> {
    const [product] = await db
      .update(products)
      .set(insertProduct)
      .where(eq(products.id, id))
      .returning();
    return product;
  }

  async deleteProduct(id: number): Promise<boolean> {
    const result = await db.delete(products).where(eq(products.id, id));
    return result.length > 0;
  }

  // Order operations
  async getOrders(): Promise<Order[]> {
    return await db.select().from(orders).orderBy(desc(orders.createdAt));
  }

  async getOrder(id: number): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order;
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const [order] = await db
      .insert(orders)
      .values(insertOrder)
      .returning();
    return order;
  }

  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const [order] = await db
      .update(orders)
      .set({ status, updatedAt: new Date() })
      .where(eq(orders.id, id))
      .returning();
    return order;
  }

  // Category operations
  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories).orderBy(categories.sortOrder);
  }

  async getCategory(id: number): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    return category;
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const [category] = await db
      .insert(categories)
      .values(insertCategory)
      .returning();
    return category;
  }

  async updateCategory(id: number, insertCategory: InsertCategory): Promise<Category | undefined> {
    const [category] = await db
      .update(categories)
      .set({ ...insertCategory, updatedAt: new Date() })
      .where(eq(categories.id, id))
      .returning();
    return category;
  }

  async deleteCategory(id: number): Promise<boolean> {
    const result = await db.delete(categories).where(eq(categories.id, id));
    return result.length > 0;
  }

  // Subcategory operations
  async getSubcategories(): Promise<Subcategory[]> {
    return await db.select().from(subcategories).orderBy(subcategories.sortOrder);
  }

  async getSubcategoriesByCategory(categoryId: number): Promise<Subcategory[]> {
    return await db
      .select()
      .from(subcategories)
      .where(eq(subcategories.categoryId, categoryId))
      .orderBy(subcategories.sortOrder);
  }

  async getSubcategory(id: number): Promise<Subcategory | undefined> {
    const [subcategory] = await db.select().from(subcategories).where(eq(subcategories.id, id));
    return subcategory;
  }

  async createSubcategory(insertSubcategory: InsertSubcategory): Promise<Subcategory> {
    const [subcategory] = await db
      .insert(subcategories)
      .values(insertSubcategory)
      .returning();
    return subcategory;
  }

  async updateSubcategory(id: number, insertSubcategory: InsertSubcategory): Promise<Subcategory | undefined> {
    const [subcategory] = await db
      .update(subcategories)
      .set({ ...insertSubcategory, updatedAt: new Date() })
      .where(eq(subcategories.id, id))
      .returning();
    return subcategory;
  }

  async deleteSubcategory(id: number): Promise<boolean> {
    const result = await db.delete(subcategories).where(eq(subcategories.id, id));
    return result.length > 0;
  }

  // Combined operations
  async getCategoriesWithSubcategories(): Promise<(Category & { subcategories: Subcategory[] })[]> {
    const allCategories = await this.getCategories();
    const result = [];
    
    for (const category of allCategories) {
      const subcats = await this.getSubcategoriesByCategory(category.id);
      result.push({
        ...category,
        subcategories: subcats,
      });
    }
    
    return result;
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
    const pendingOrders = allOrders.filter(order => order.status === 'pending');
    const totalRevenue = allOrders
      .filter(order => order.status === 'delivered')
      .reduce((sum, order) => sum + order.totalAmount, 0);
    const recentOrders = allOrders.slice(0, 5);

    return {
      totalProducts: allProducts.length,
      totalOrders: allOrders.length,
      pendingOrders: pendingOrders.length,
      totalRevenue,
      recentOrders,
    };
  }
}

// Initialize with sample data for development
export class DatabaseStorageWithInit extends DatabaseStorage {
  private initialized = false;

  async ensureInitialized() {
    if (this.initialized) return;

    try {
      // Check if we have any products
      const existingProducts = await super.getProducts();
      if (existingProducts.length > 0) {
        this.initialized = true;
        return;
      }

      // Create sample categories
      const iphoneCategory = await this.createCategory({
        name: "iPhone",
        slug: "iphone",
        description: "Os mais recentes modelos de iPhone",
        isActive: true,
        sortOrder: 1,
      });

      const accessoriesCategory = await this.createCategory({
        name: "Acessórios",
        slug: "acessorios",
        description: "Acessórios para dispositivos Apple",
        isActive: true,
        sortOrder: 2,
      });

      // Create sample products
      await this.createProduct({
        name: "AirSound Pro",
        description: "Fones de ouvido sem fio com cancelamento de ruído ativo",
        price: 89900, // 899.00 AOA in centavos
        imageUrl: "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&q=80&w=500",
        categoryId: accessoriesCategory.id,
        subcategoryId: null,
        featured: true,
      });

      await this.createProduct({
        name: "iPhone 16 Pro",
        description: "O iPhone mais avançado com chip A18 Pro",
        price: 299900, // 2999.00 AOA in centavos
        imageUrl: "https://images.unsplash.com/photo-1592286667653-d827d2e7c5e6?auto=format&fit=crop&q=80&w=500",
        categoryId: iphoneCategory.id,
        subcategoryId: null,
        featured: true,
      });

      await this.createProduct({
        name: "TimeSync Elite",
        description: "Smartwatch com monitoramento avançado de saúde",
        price: 149900, // 1499.00 AOA in centavos
        imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=500",
        categoryId: accessoriesCategory.id,
        subcategoryId: null,
        featured: true,
      });

      this.initialized = true;
    } catch (error) {
      console.error('Error initializing database:', error);
    }
  }

  async getProducts(): Promise<Product[]> {
    await this.ensureInitialized();
    return super.getProducts();
  }

  async getFeaturedProducts(): Promise<Product[]> {
    await this.ensureInitialized();
    return super.getFeaturedProducts();
  }
}

export const storage = new DatabaseStorageWithInit();
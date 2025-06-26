import type { Application, Request, Response } from "express";
import { storage } from "./storage";
import { insertProductSchema, insertOrderSchema, insertCategorySchema, insertSubcategorySchema } from "@shared/schema";

export async function registerServerlessRoutes(app: Application) {
  // Get all products
  app.get("/api/products", async (req: Request, res: Response) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  // Get featured products
  app.get("/api/products/featured", async (req: Request, res: Response) => {
    try {
      const products = await storage.getFeaturedProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured products" });
    }
  });

  // Get single product
  app.get("/api/products/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.getProduct(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  // Create product
  app.post("/api/products", async (req, res) => {
    try {
      const parsed = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(parsed);
      res.status(201).json(product);
    } catch (error) {
      res.status(400).json({ message: "Invalid product data" });
    }
  });

  // Update product
  app.put("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const parsed = insertProductSchema.parse(req.body);
      const product = await storage.updateProduct(id, parsed);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(400).json({ message: "Invalid product data" });
    }
  });

  // Delete product
  app.delete("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteProduct(id);
      if (!success) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete product" });
    }
  });

  // Get all orders
  app.get("/api/orders", async (req, res) => {
    try {
      const orders = await storage.getOrders();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  // Create order
  app.post("/api/orders", async (req, res) => {
    try {
      const parsed = insertOrderSchema.parse(req.body);
      const order = await storage.createOrder(parsed);
      res.status(201).json(order);
    } catch (error) {
      console.error("Order creation error:", error);
      res.status(400).json({ message: "Invalid order data" });
    }
  });

  // Update order status
  app.patch("/api/orders/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      const order = await storage.updateOrderStatus(id, status);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      res.status(400).json({ message: "Failed to update order status" });
    }
  });

  // Get all categories
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  // Get categories with subcategories
  app.get("/api/categories/with-subcategories", async (req, res) => {
    try {
      const categories = await storage.getCategoriesWithSubcategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories with subcategories" });
    }
  });

  // Create category
  app.post("/api/categories", async (req, res) => {
    try {
      const parsed = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(parsed);
      res.status(201).json(category);
    } catch (error) {
      res.status(400).json({ message: "Invalid category data" });
    }
  });

  // Update category
  app.put("/api/categories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const parsed = insertCategorySchema.parse(req.body);
      const category = await storage.updateCategory(id, parsed);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      res.status(400).json({ message: "Invalid category data" });
    }
  });

  // Delete category
  app.delete("/api/categories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteCategory(id);
      if (!success) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete category" });
    }
  });

  // Get all subcategories
  app.get("/api/subcategories", async (req, res) => {
    try {
      const subcategories = await storage.getSubcategories();
      res.json(subcategories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch subcategories" });
    }
  });

  // Create subcategory
  app.post("/api/subcategories", async (req, res) => {
    try {
      const parsed = insertSubcategorySchema.parse(req.body);
      const subcategory = await storage.createSubcategory(parsed);
      res.status(201).json(subcategory);
    } catch (error) {
      res.status(400).json({ message: "Invalid subcategory data" });
    }
  });

  // Update subcategory
  app.put("/api/subcategories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const parsed = insertSubcategorySchema.parse(req.body);
      const subcategory = await storage.updateSubcategory(id, parsed);
      if (!subcategory) {
        return res.status(404).json({ message: "Subcategory not found" });
      }
      res.json(subcategory);
    } catch (error) {
      res.status(400).json({ message: "Invalid subcategory data" });
    }
  });

  // Delete subcategory
  app.delete("/api/subcategories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteSubcategory(id);
      if (!success) {
        return res.status(404).json({ message: "Subcategory not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete subcategory" });
    }
  });

  // Get dashboard stats
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });
}
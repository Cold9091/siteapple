import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(), // price in centavos (AOA)
  imageUrl: text("image_url").notNull(),
  category: text("category").notNull(),
  featured: boolean("featured").notNull().default(false),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone"),
  items: jsonb("items").notNull(), // Array of {productId, quantity, price}
  totalAmount: integer("total_amount").notNull(), // total in centavos (AOA)
  status: text("status").notNull().default("pending"), // pending, processing, shipped, delivered, cancelled
  shippingAddress: text("shipping_address").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
}).extend({
  category: z.enum(["iPhone", "Mac", "iPad", "Watch", "AirPods", "Fones", "Carregadores", "Relógios", "Outros"]),
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  status: z.enum(["pending", "processing", "shipped", "delivered", "cancelled"]).default("pending"),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;

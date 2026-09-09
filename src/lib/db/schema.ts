import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const products = sqliteTable("products", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  payload: text("payload", { mode: "json" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

export const newsletter = sqliteTable("newsletter", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  source: text("source").notNull().default("delayed_popup"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

export const orders = sqliteTable("orders", {
  id: text("id").primaryKey(),
  email: text("email").notNull(),
  payload: text("payload", { mode: "json" }).notNull(),
  giftWrap: integer("gift_wrap", { mode: "boolean" }).notNull().default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

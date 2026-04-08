import { pgTable, text, integer, boolean, timestamp, jsonb, serial } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

export const adminUsers = pgTable('admin_users', {
  id: serial('id').primaryKey(),
  username: text('username').unique().notNull(),
  passwordHash: text('password_hash').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const perfumes = pgTable('perfumes', {
  id: text('id').primaryKey(),
  nameAr: text('name_ar').notNull(),
  nameEn: text('name_en').notNull(),
  nameTr: text('name_tr').notNull(),
  descriptionAr: text('description_ar').notNull(),
  descriptionEn: text('description_en').notNull(),
  descriptionTr: text('description_tr').notNull(),
  category: text('category').notNull(),
  price50ml: integer('price_50ml').notNull(),
  price100ml: integer('price_100ml').notNull(),
  imageUrl: text('image_url').notNull(),
  inspiredBy: text('inspired_by').notNull(),
  originalPerfume: text('original_perfume').notNull(),
  notesTopAr: text('notes_top_ar').notNull().default(''),
  notesTopEn: text('notes_top_en').notNull().default(''),
  notesTopTr: text('notes_top_tr').notNull().default(''),
  notesMiddleAr: text('notes_middle_ar').notNull().default(''),
  notesMiddleEn: text('notes_middle_en').notNull().default(''),
  notesMiddleTr: text('notes_middle_tr').notNull().default(''),
  notesBaseAr: text('notes_base_ar').notNull().default(''),
  notesBaseEn: text('notes_base_en').notNull().default(''),
  notesBaseTr: text('notes_base_tr').notNull().default(''),
  featured: boolean('featured').default(false).notNull(),
  active: boolean('active').default(true).notNull(),
  sortOrder: integer('sort_order').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const offers = pgTable('offers', {
  id: serial('id').primaryKey(),
  type: text('type').notNull(),
  targetValue: text('target_value'),
  label: text('label').notNull(),
  discountPercent: integer('discount_percent').notNull(),
  startDate: timestamp('start_date'),
  endDate: timestamp('end_date'),
  active: boolean('active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  customerName: text('customer_name').notNull(),
  whatsappPhone: text('whatsapp_phone').notNull().default(''),
  items: jsonb('items').notNull(),
  subtotal: integer('subtotal').notNull(),
  discountAmount: integer('discount_amount').default(0).notNull(),
  total: integer('total').notNull(),
  status: text('status').default('new').notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const siteSettings = pgTable('site_settings', {
  key: text('key').primaryKey(),
  value: jsonb('value').notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const insertPerfumeSchema = createInsertSchema(perfumes);
export const insertOfferSchema = createInsertSchema(offers).omit({ id: true, createdAt: true });
export const insertOrderSchema = createInsertSchema(orders).omit({ id: true, createdAt: true, updatedAt: true });

export type Perfume = typeof perfumes.$inferSelect;
export type InsertPerfume = z.infer<typeof insertPerfumeSchema>;
export type Offer = typeof offers.$inferSelect;
export type InsertOffer = z.infer<typeof insertOfferSchema>;
export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type SiteSetting = typeof siteSettings.$inferSelect;

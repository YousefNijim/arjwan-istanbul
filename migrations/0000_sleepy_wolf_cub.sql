CREATE TABLE "admin_users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"password_hash" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "admin_users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "offers" (
	"id" serial PRIMARY KEY NOT NULL,
	"type" text NOT NULL,
	"target_value" text,
	"label" text NOT NULL,
	"discount_percent" integer NOT NULL,
	"start_date" timestamp,
	"end_date" timestamp,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"customer_name" text NOT NULL,
	"whatsapp_phone" text DEFAULT '' NOT NULL,
	"items" jsonb NOT NULL,
	"subtotal" integer NOT NULL,
	"discount_amount" integer DEFAULT 0 NOT NULL,
	"total" integer NOT NULL,
	"status" text DEFAULT 'new' NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "perfumes" (
	"id" text PRIMARY KEY NOT NULL,
	"name_ar" text NOT NULL,
	"name_en" text NOT NULL,
	"name_tr" text NOT NULL,
	"description_ar" text NOT NULL,
	"description_en" text NOT NULL,
	"description_tr" text NOT NULL,
	"category" text NOT NULL,
	"price_50ml" integer NOT NULL,
	"price_100ml" integer NOT NULL,
	"image_url" text NOT NULL,
	"inspired_by" text NOT NULL,
	"original_perfume" text NOT NULL,
	"notes_top_ar" text DEFAULT '' NOT NULL,
	"notes_top_en" text DEFAULT '' NOT NULL,
	"notes_top_tr" text DEFAULT '' NOT NULL,
	"notes_middle_ar" text DEFAULT '' NOT NULL,
	"notes_middle_en" text DEFAULT '' NOT NULL,
	"notes_middle_tr" text DEFAULT '' NOT NULL,
	"notes_base_ar" text DEFAULT '' NOT NULL,
	"notes_base_en" text DEFAULT '' NOT NULL,
	"notes_base_tr" text DEFAULT '' NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "site_settings" (
	"key" text PRIMARY KEY NOT NULL,
	"value" jsonb NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

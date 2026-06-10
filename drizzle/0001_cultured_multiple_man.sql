CREATE TABLE "app_settings" (
	"id" text PRIMARY KEY NOT NULL,
	"point_earn_rate_bps" integer DEFAULT 100 NOT NULL,
	"gold_point_multiplier_bps" integer DEFAULT 15000 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

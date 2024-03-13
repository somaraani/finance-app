CREATE SCHEMA "finance";
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "finance"."accounts" (
	"id" serial PRIMARY KEY NOT NULL,
	"institution_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"subtype" text NOT NULL,
	"account_id" text NOT NULL,
	"persistant_account_id" text,
	CONSTRAINT "accounts_account_id_unique" UNIQUE("account_id"),
	CONSTRAINT "accounts_persistant_account_id_unique" UNIQUE("persistant_account_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "finance"."balances" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"account_id" integer NOT NULL,
	"balance" double precision NOT NULL,
	"currency_code" text NOT NULL,
	"timestamp" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "finance"."institutions" (
	"id" serial PRIMARY KEY NOT NULL,
	"plaid_id" text,
	"name" varchar(255) NOT NULL,
	"logo" text,
	CONSTRAINT "institutions_plaid_id_unique" UNIQUE("plaid_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "finance"."sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "finance"."user_institutions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"institution_id" integer NOT NULL,
	"access_token" text NOT NULL,
	"item_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "finance"."users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"firstName" text NOT NULL,
	"lastName" text NOT NULL,
	"password" text NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "finance"."accounts" ADD CONSTRAINT "accounts_institution_id_institutions_id_fk" FOREIGN KEY ("institution_id") REFERENCES "finance"."institutions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "finance"."accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "finance"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "finance"."balances" ADD CONSTRAINT "balances_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "finance"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "finance"."balances" ADD CONSTRAINT "balances_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "finance"."accounts"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "finance"."sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "finance"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "finance"."user_institutions" ADD CONSTRAINT "user_institutions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "finance"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "finance"."user_institutions" ADD CONSTRAINT "user_institutions_institution_id_institutions_id_fk" FOREIGN KEY ("institution_id") REFERENCES "finance"."institutions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

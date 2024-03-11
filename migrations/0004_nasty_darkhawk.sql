ALTER TABLE "finance"."accounts" ADD COLUMN "institution_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "finance"."accounts" ADD COLUMN "user_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "finance"."accounts" ADD COLUMN "name" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "finance"."accounts" ADD COLUMN "type" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "finance"."accounts" ADD COLUMN "subtype" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "finance"."accounts" ADD COLUMN "account_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "finance"."accounts" ADD CONSTRAINT "accounts_account_id_unique" UNIQUE("account_id");
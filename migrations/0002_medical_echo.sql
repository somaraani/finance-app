CREATE TABLE IF NOT EXISTS "finance"."user_institutions" (
	"user_id" text NOT NULL,
	"institution_id" text NOT NULL,
	"access_token" text NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "finance"."user_institutions" ADD CONSTRAINT "user_institutions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "finance"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

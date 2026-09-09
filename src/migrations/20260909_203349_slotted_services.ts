import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_service_type" AS ENUM('simple', 'slotted');
  CREATE TYPE "public"."enum_service_slot_weekdays" AS ENUM('mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun');
  CREATE TYPE "public"."enum_slot_booking_status" AS ENUM('reserved', 'confirmed', 'cancelled');
  CREATE TABLE "service_slot_weekdays" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_service_slot_weekdays",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "service_slot" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"service_id" integer NOT NULL,
  	"start_time" varchar NOT NULL,
  	"end_time" varchar NOT NULL,
  	"price" numeric NOT NULL,
  	"adult_price" numeric NOT NULL,
  	"capacity" numeric NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "slot_booking" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order_reference" varchar,
  	"ticket_code" varchar,
  	"service_id" integer,
  	"slot_id" integer,
  	"date" timestamp(3) with time zone,
  	"children_qty" numeric,
  	"adults_qty" numeric,
  	"total_amount" numeric,
  	"status" "enum_slot_booking_status" DEFAULT 'reserved',
  	"valid_until" timestamp(3) with time zone,
  	"client_name" varchar,
  	"client_phone" varchar,
  	"client_email" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
   ALTER TABLE "service" ALTER COLUMN "price" SET DEFAULT 0;
   UPDATE "service" SET "price" = 0 WHERE "price" IS NULL;
   ALTER TABLE "service" ALTER COLUMN "price" SET NOT NULL;
   ALTER TABLE "service" ADD COLUMN "type" "enum_service_type" DEFAULT 'simple' NOT NULL;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "service_slot_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "slot_booking_id" integer;
  ALTER TABLE "service_slot_weekdays" ADD CONSTRAINT "service_slot_weekdays_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."service_slot"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "service_slot" ADD CONSTRAINT "service_slot_service_id_service_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."service"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "slot_booking" ADD CONSTRAINT "slot_booking_service_id_service_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."service"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "slot_booking" ADD CONSTRAINT "slot_booking_slot_id_service_slot_id_fk" FOREIGN KEY ("slot_id") REFERENCES "public"."service_slot"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "service_slot_weekdays_order_idx" ON "service_slot_weekdays" USING btree ("order");
  CREATE INDEX "service_slot_weekdays_parent_idx" ON "service_slot_weekdays" USING btree ("parent_id");
  CREATE INDEX "service_slot_service_idx" ON "service_slot" USING btree ("service_id");
  CREATE INDEX "service_slot_updated_at_idx" ON "service_slot" USING btree ("updated_at");
  CREATE INDEX "service_slot_created_at_idx" ON "service_slot" USING btree ("created_at");
  CREATE INDEX "slot_booking_order_reference_idx" ON "slot_booking" USING btree ("order_reference");
  CREATE INDEX "slot_booking_ticket_code_idx" ON "slot_booking" USING btree ("ticket_code");
  CREATE INDEX "slot_booking_service_idx" ON "slot_booking" USING btree ("service_id");
  CREATE INDEX "slot_booking_slot_idx" ON "slot_booking" USING btree ("slot_id");
  CREATE INDEX "slot_booking_updated_at_idx" ON "slot_booking" USING btree ("updated_at");
  CREATE INDEX "slot_booking_created_at_idx" ON "slot_booking" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_service_slot_fk" FOREIGN KEY ("service_slot_id") REFERENCES "public"."service_slot"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_slot_booking_fk" FOREIGN KEY ("slot_booking_id") REFERENCES "public"."slot_booking"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_service_slot_id_idx" ON "payload_locked_documents_rels" USING btree ("service_slot_id");
  CREATE INDEX "payload_locked_documents_rels_slot_booking_id_idx" ON "payload_locked_documents_rels" USING btree ("slot_booking_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "service_slot_weekdays" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "service_slot" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "slot_booking" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "service_slot_weekdays" CASCADE;
  DROP TABLE "service_slot" CASCADE;
  DROP TABLE "slot_booking" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_service_slot_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_slot_booking_fk";
  
  DROP INDEX "payload_locked_documents_rels_service_slot_id_idx";
  DROP INDEX "payload_locked_documents_rels_slot_booking_id_idx";
  ALTER TABLE "service" ALTER COLUMN "price" DROP DEFAULT;
  ALTER TABLE "service" ALTER COLUMN "price" SET NOT NULL;
  ALTER TABLE "service" DROP COLUMN "type";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "service_slot_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "slot_booking_id";
  DROP TYPE "public"."enum_service_type";
  DROP TYPE "public"."enum_service_slot_weekdays";
  DROP TYPE "public"."enum_slot_booking_status";`)
}

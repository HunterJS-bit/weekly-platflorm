import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   UPDATE "media" SET "alt" = COALESCE(NULLIF("alt", ''), "filename", 'Slika') WHERE "alt" IS NULL OR "alt" = '';
  ALTER TABLE "media" ALTER COLUMN "alt" SET NOT NULL;
  ALTER TABLE "categories" ADD COLUMN "meta_title" varchar;
  ALTER TABLE "categories" ADD COLUMN "meta_image_id" integer;
  ALTER TABLE "categories" ADD COLUMN "meta_description" varchar;
  ALTER TABLE "users" ADD COLUMN "meta_title" varchar;
  ALTER TABLE "users" ADD COLUMN "meta_image_id" integer;
  ALTER TABLE "users" ADD COLUMN "meta_description" varchar;
  ALTER TABLE "categories" ADD CONSTRAINT "categories_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "users" ADD CONSTRAINT "users_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "categories_meta_meta_image_idx" ON "categories" USING btree ("meta_image_id");
  CREATE INDEX "users_meta_meta_image_idx" ON "users" USING btree ("meta_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "categories" DROP CONSTRAINT "categories_meta_image_id_media_id_fk";
  
  ALTER TABLE "users" DROP CONSTRAINT "users_meta_image_id_media_id_fk";
  
  DROP INDEX "categories_meta_meta_image_idx";
  DROP INDEX "users_meta_meta_image_idx";
  ALTER TABLE "media" ALTER COLUMN "alt" DROP NOT NULL;
  ALTER TABLE "categories" DROP COLUMN "meta_title";
  ALTER TABLE "categories" DROP COLUMN "meta_image_id";
  ALTER TABLE "categories" DROP COLUMN "meta_description";
  ALTER TABLE "users" DROP COLUMN "meta_title";
  ALTER TABLE "users" DROP COLUMN "meta_image_id";
  ALTER TABLE "users" DROP COLUMN "meta_description";`)
}

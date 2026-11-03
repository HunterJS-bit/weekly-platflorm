import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "footer" ADD COLUMN "description" varchar;
  ALTER TABLE "footer" ADD COLUMN "social_links_facebook" varchar;
  ALTER TABLE "footer" ADD COLUMN "social_links_x" varchar;
  ALTER TABLE "footer" ADD COLUMN "social_links_instagram" varchar;
  ALTER TABLE "footer" ADD COLUMN "social_links_linkedin" varchar;
  ALTER TABLE "footer" ADD COLUMN "social_links_youtube" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "footer" DROP COLUMN "description";
  ALTER TABLE "footer" DROP COLUMN "social_links_facebook";
  ALTER TABLE "footer" DROP COLUMN "social_links_x";
  ALTER TABLE "footer" DROP COLUMN "social_links_instagram";
  ALTER TABLE "footer" DROP COLUMN "social_links_linkedin";
  ALTER TABLE "footer" DROP COLUMN "social_links_youtube";`)
}

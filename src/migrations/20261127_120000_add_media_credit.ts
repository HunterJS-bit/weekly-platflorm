import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/** Credits live on the media asset; caption placement lives on the block. */
export async function up({ db, payload: _payload, req: _req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "credit" varchar;
    ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "credit_url" varchar;
    ALTER TABLE "pages_blocks_media_block" ADD COLUMN IF NOT EXISTS "caption_position" varchar DEFAULT 'below';
    ALTER TABLE "_pages_v_blocks_media_block" ADD COLUMN IF NOT EXISTS "caption_position" varchar DEFAULT 'below';
  `)
}

export async function down({ db, payload: _payload, req: _req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "media" DROP COLUMN IF EXISTS "credit";
    ALTER TABLE "media" DROP COLUMN IF EXISTS "credit_url";
    ALTER TABLE "pages_blocks_media_block" DROP COLUMN IF EXISTS "caption_position";
    ALTER TABLE "_pages_v_blocks_media_block" DROP COLUMN IF EXISTS "caption_position";
  `)
}

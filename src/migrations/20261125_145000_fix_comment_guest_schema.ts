import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/**
 * The 20261122 migration was already applied when the honeypot column was
 * added to it, so Payload skipped that change. Guest comments also need
 * `author_id` to be nullable because the `author` field is optional.
 */
export async function up({ db, payload: _payload, req: _req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "comments" ALTER COLUMN "author_id" DROP NOT NULL;
    ALTER TABLE "comments" ADD COLUMN IF NOT EXISTS "honeypot" varchar;
  `)
}

export async function down({ db, payload: _payload, req: _req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "comments" DROP COLUMN IF EXISTS "honeypot";
  `)

  // `author_id` is intentionally left nullable: making it NOT NULL again would
  // fail for guest comments created while this migration was active.
}

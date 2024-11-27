import { sql } from "./db";

export async function createSnapshot(options?: { overwrite: boolean }) {
  if (options?.overwrite) {
    await sql`DROP TABLE IF EXISTS members_snapshot`;
    await sql`CREATE TABLE members_snapshot AS TABLE members`;
    return;
  }

  const exists = await sql`
    SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_name = 'members_snapshot'
    )
  `;

  if (!exists[0].exists) {
    await sql`CREATE TABLE members_snapshot AS TABLE members`;
  }
}

export async function restoreFromSnapshot() {
  await sql`DROP TABLE IF EXISTS members`;
  await sql`CREATE TABLE members AS TABLE members_snapshot`;

  return true;
}

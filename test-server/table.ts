import { sql } from "./db";

export async function createSnapshot() {
  await sql`DROP TABLE IF EXISTS members_snapshot`;
  await sql`CREATE TABLE members_snapshot AS TABLE members`;
}

export async function restoreFromSnapshot() {
  await sql`DROP TABLE IF EXISTS members`;
  await sql`CREATE TABLE members AS TABLE members_snapshot`;

  return true;
}

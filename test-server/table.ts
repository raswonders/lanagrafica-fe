import { sql } from "./db";
import fs from "fs";

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

export async function exportMembersData() {
  const filename = "members-dump.json";
  try {
    const rows = await sql`SELECT * FROM members`;
    fs.writeFileSync(filename, JSON.stringify(rows, null, 2), "utf-8");
    console.log(`Members exported to ${filename}`);
  } catch (error) {
    console.error("Error exporting data:", error);
  } finally {
    await sql.end();
  }
}

export async function insertMembersData() {
  const filename = "members-dump.json";
  try {
    const data = JSON.parse(fs.readFileSync(filename, "utf-8"));

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const { id, name_surname, ...row } of data) {
      await sql`INSERT INTO members ${sql(row)}`;
    }

    console.log("Members inserted");
  } catch (error) {
    console.error("Errors inserting members", error);
  } finally {
    await sql.end();
  }
}

export async function updateIsActive() {
  try {
    const today = new Date();
    const result = await sql`
    UPDATE members
    SET is_active = false 
    WHERE is_deleted = true
      OR expiration_date < ${today}
      OR suspended_till > ${today};
    `;
    console.log(`Updated ${result.count} rows in the 'members' table.`);
  } catch (error) {
    console.error("Error updating members", error);
  } finally {
    await sql.end();
  }
}

export async function createMembersTable() {
  try {
    await sql`
    DROP TABLE IF EXISTS members;
  `;

    await sql`
      CREATE TABLE members (
        id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        birth_date TIMESTAMP WITH TIME ZONE NOT NULL,
        birth_place TEXT,
        card_number TEXT,
        country TEXT,
        doc_id TEXT,
        doc_type TEXT,
        email TEXT,
        expiration_date TIMESTAMP WITH TIME ZONE,
        is_active BOOLEAN,
        is_deleted BOOLEAN,
        measure TEXT,
        name TEXT,
        note TEXT,
        province TEXT,
        registration_date TIMESTAMP WITH TIME ZONE,
        surname TEXT,
        suspended_till TIMESTAMP WITH TIME ZONE,
        name_surname TEXT GENERATED ALWAYS AS (name || ' ' || surname) STORED
      );
    `;
    console.log('Table "members" created successfully!');

    await sql`
      CREATE INDEX idx_name_surname ON members USING GIN (to_tsvector('italian', name_surname));
    `;
    console.log('Index "idx_name_surname" created successfully!');
  } catch (error) {
    console.error("Error creating table or index:", error);
  } finally {
    await sql.end();
  }
}

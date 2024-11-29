import path from "path";
import { sql } from "./db";
import fs from "fs";
import { fileURLToPath } from "url";

export async function createMembersSnapshot() {
  try {
    await sql`DROP TABLE IF EXISTS members_snapshot`;
    await sql`CREATE TABLE members_snapshot AS TABLE members`;
    console.log(`Table "members_snapshot" created`);
  } catch (error) {
    console.error("Error: creating snapshot:", error);
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
  }
}

export async function insertMembersData() {
  const filename = "members-dump.json";
  const __dirname = path.dirname(fileURLToPath(import.meta.url));

  try {
    const data = JSON.parse(
      fs.readFileSync(path.join(__dirname, filename), "utf-8"),
    );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const { id, name_surname, ...row } of data) {
      await sql`INSERT INTO members ${sql(row)}`;
    }
    console.log("Members inserted");
  } catch (error) {
    console.error("Errors inserting members", error);
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
    console.log('Table "members" created');

    await sql`
      CREATE INDEX idx_name_surname ON members USING GIN (to_tsvector('italian', name_surname));
    `;
    console.log('Index "idx_name_surname" created');
  } catch (error) {
    console.error("Error creating table or index:", error);
  }
}

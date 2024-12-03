import { sql } from "../db";
import {
  createMembersSnapshot,
  createMembersTable,
  insertMembersData,
  updateIsActive,
} from "../table";

await createMembersTable();
await insertMembersData();
await updateIsActive();
await createMembersSnapshot();
await sql.end();

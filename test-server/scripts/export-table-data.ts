import { sql } from "../db";
import { exportMembersData } from "../table";

await exportMembersData();
await sql.end();

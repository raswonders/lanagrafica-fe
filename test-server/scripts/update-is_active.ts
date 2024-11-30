import { sql } from "../db";
import { updateIsActive } from "../table";

await updateIsActive();
await sql.end();

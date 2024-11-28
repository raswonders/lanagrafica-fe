import postgres from "postgres";
import { fileURLToPath } from "url";
import * as dotenv from "dotenv";
import path from "path";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({
  path: path.join(__dirname, "../.env"),
});
const DBString = process.env.DATABASE_URL;

if (!DBString) {
  throw new Error("DATABASE_URL is missing from .env");
}

export const sql = postgres(DBString);

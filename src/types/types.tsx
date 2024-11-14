import { z } from "zod";
import { Database } from "./supabase.types";

export const UserSchema = z.object({
  username: z.string(),
  jwt: z.string(),
});

export type User = z.infer<typeof UserSchema> | null;

export type MemberRow = Database["public"]["Tables"]["members"]["Row"];
export type MemberUpdate = Database["public"]["Tables"]["members"]["Update"];
export type MemberInsert = Database["public"]["Tables"]["members"]["Insert"];

export type MemberExt = MemberRow & {
  status: "active" | "inactive" | "expired" | "suspended" | "deleted";
};

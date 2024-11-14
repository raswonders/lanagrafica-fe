import { z } from "zod";
import { Database, Tables } from "./supabase.types";

export const UserSchema = z.object({
  username: z.string(),
  jwt: z.string(),
});

export type User = z.infer<typeof UserSchema> | null;

export type MemberDB = Tables<"members">;
export type MemberExt = MemberDB & {
  status: "active" | "inactive" | "expired" | "suspended" | "deleted";
};
export type MemberUpdate = Database["public"]["Tables"]["members"]["Update"];
export type MemberInsert = Database["public"]["Tables"]["members"]["Insert"];

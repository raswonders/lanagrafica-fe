import { Database } from "./supabase.types";

export type MemberStatus =
  | "active"
  | "inactive"
  | "expired"
  | "suspended"
  | "deleted";
export type MemberRow = Database["public"]["Tables"]["members"]["Row"];
export type MemberUpdate = Database["public"]["Tables"]["members"]["Update"];
export type MemberInsert = Database["public"]["Tables"]["members"]["Insert"];
export type MemberExt = MemberRow & {
  status: MemberStatus;
};

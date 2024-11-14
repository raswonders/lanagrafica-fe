import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/supabase.types";

const supabaseUrl = "https://rhesoyqwegzcbzisejuv.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJoZXNveXF3ZWd6Y2J6aXNlanV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzExNjk1MDMsImV4cCI6MjA0Njc0NTUwM30.AX48_9eSNxaPswHlIpffnwh86zrpN1xuqcTNZ7qxGlk";

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

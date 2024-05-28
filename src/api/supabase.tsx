
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://anlhkcaoszuqiatipxjr.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFubGhrY2Fvc3p1cWlhdGlweGpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTI2ODE2NDYsImV4cCI6MjAyODI1NzY0Nn0.GQAGYJnpI0tS9cKqiE0ac3z9c_2iOFwcSC35qV1heyc";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
import { test } from "@playwright/test";
import { supabase } from "../src/api/supabase";

// Generates minimal weekly traffic
test("supabase db should be reachable", async () => {
  const { data, error } = await supabase.from("members").select("*").limit(1);

  if (error) {
    throw new Error("Failed fetch data from supabase");
  }

  console.log(data);
});

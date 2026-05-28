import fs from "fs";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);

async function seedEmployees() {
  try {
    const rawData = fs.readFileSync("src/lib/seed/generated.json", "utf-8");
    const employees = JSON.parse(rawData);

    const batchSize = 1000;

    for (let i = 0; i < employees.length; i += batchSize) {
      const batch = employees.slice(i, i + batchSize);

      const { error } = await supabase
        .from("employees")
        .insert(batch);

      if (error) {
        console.error("Batch insert failed:", error);
        return;
      }

      console.log(`Inserted ${i + batch.length} employees`);
    }

    console.log("Seeding completed successfully 🚀");
  } catch (err) {
    console.error(err);
  }
}

seedEmployees();
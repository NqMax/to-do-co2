import { db } from "@/db/db";
import { departmentsTable, rolesTable } from "@/db/schema";

const departmentNames = [
  "humanResources",
  "finance",
  "businessIntelligence",
] as const;
const roleNames = ["supervisor", "standard"] as const;

async function seed() {
  await db
    .insert(departmentsTable)
    .values(departmentNames.map((name) => ({ name })))
    .onConflictDoNothing({ target: departmentsTable.name });

  await db
    .insert(rolesTable)
    .values(roleNames.map((name) => ({ name })))
    .onConflictDoNothing({ target: rolesTable.name });
}

seed()
  .then(() => {
    console.log("Seed complete.");
  })
  .catch((err) => {
    console.error("Seed failed:", err);
  });

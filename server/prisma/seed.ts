import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../generated/prisma/client.js";

const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST!,
  user: process.env.DATABASE_USER!,
  password: process.env.DATABASE_PASSWORD!,
  database: process.env.DATABASE_NAME!,
  connectionLimit: 5,
});

const prisma = new PrismaClient({ adapter });

const departments = [
  { acronym: "BSIT", departmentName: "Bachelor of Science in Information Technology" },
  { acronym: "BSCS", departmentName: "Bachelor of Science in Computer Science" },
  { acronym: "BSSW", departmentName: "Bachelor of Science in Social Work" },
  { acronym: "BECEd", departmentName: "Bachelor of Early Childhood Education" },
];

async function main() {
  console.log("seeding departments...");

  for (const dept of departments) {
    const existing = await prisma.department.findFirst({
      where: { acronym: dept.acronym },
    });

    if (!existing) {
      await prisma.department.create({ data: dept });
      console.log(`  + ${dept.acronym}`);
    } else {
      console.log(`  ~ ${dept.acronym} (already exists)`);
    }
  }

  console.log("done!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

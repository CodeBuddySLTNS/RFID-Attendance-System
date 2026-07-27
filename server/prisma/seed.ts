import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../server/generated/prisma/client.js";

const adapter = new PrismaPg(process.env.DATABASE_URL!);
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

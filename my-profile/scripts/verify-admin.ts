import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not configured");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

async function main() {
  const admin = await prisma.user.findFirst({
    where: { role: "ADMIN" },
    select: {
      id: true,
      role: true,
      email: true,
    },
  });

  console.log(
    admin ? "Admin account verified." : "No admin account found.",
    admin ? { id: admin.id, role: admin.role } : "",
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

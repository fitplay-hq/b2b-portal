import { $Enums } from "@/lib/generated/prisma";
import prisma from "../lib/prisma";

async function main() {
  await prisma.admin.upsert({
    where: { email: process.env.ADMIN_EMAIL! },
    update: {},
    create: {
      email: process.env.ADMIN_EMAIL!,
      name: "Admin",
      password: process.env.ADMIN_PASSWORD_HASH!,
      role: $Enums.Role.ADMIN,
    },
  });

  console.log("✅ Admin seeded successfully");
}

main().catch(console.error).finally(() => process.exit());
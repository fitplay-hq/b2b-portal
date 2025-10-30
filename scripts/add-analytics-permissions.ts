import prisma from "../lib/prisma";

async function addAnalyticsPermissions() {
  console.log("🔧 Adding analytics permissions to database...");

  try {
    // Add analytics read permission
    const readPermission = await prisma.systemPermission.upsert({
      where: { 
        resource_action: { 
          resource: "analytics", 
          action: "read" 
        }
      },
      update: { description: "View analytics dashboard" },
      create: {
        resource: "analytics",
        action: "read",
        description: "View analytics dashboard"
      },
    });

    console.log("✅ Created/Updated analytics read permission:", readPermission);

    // Add analytics export permission
    const exportPermission = await prisma.systemPermission.upsert({
      where: { 
        resource_action: { 
          resource: "analytics", 
          action: "export" 
        }
      },
      update: { description: "Export analytics data" },
      create: {
        resource: "analytics",
        action: "export",
        description: "Export analytics data"
      },
    });

    console.log("✅ Created/Updated analytics export permission:", exportPermission);

    // Verify by listing all analytics permissions
    const allAnalyticsPermissions = await prisma.systemPermission.findMany({
      where: {
        resource: "analytics"
      }
    });

    console.log("📊 All analytics permissions in database:");
    allAnalyticsPermissions.forEach(perm => {
      console.log(`  - ${perm.resource}.${perm.action}: ${perm.description}`);
    });

    console.log("🎉 Analytics permissions successfully added!");

  } catch (error) {
    console.error("❌ Error adding analytics permissions:", error);
    throw error;
  }
}

// Run the function
addAnalyticsPermissions()
  .catch((e) => {
    console.error("Failed to add analytics permissions:");
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log("🔌 Database connection closed");
  });
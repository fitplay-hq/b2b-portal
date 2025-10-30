import prisma from "../lib/prisma";

async function testPermissions() {
  console.log("🔍 Testing permissions in database...");

  try {
    // Get all permissions
    const allPermissions = await prisma.systemPermission.findMany({
      orderBy: [
        { resource: 'asc' },
        { action: 'asc' }
      ]
    });

    console.log("📊 Total permissions in database:", allPermissions.length);

    // Group by resource
    const byResource = allPermissions.reduce((acc, perm) => {
      if (!acc[perm.resource]) acc[perm.resource] = [];
      acc[perm.resource].push(perm.action);
      return acc;
    }, {} as Record<string, string[]>);

    console.log("📋 Permissions by resource:");
    Object.keys(byResource).sort().forEach(resource => {
      console.log(`  ${resource}: ${byResource[resource].join(', ')}`);
    });

    // Specifically check analytics
    const analyticsPerms = allPermissions.filter(p => p.resource === 'analytics');
    console.log("\n🎯 Analytics permissions:");
    analyticsPerms.forEach(perm => {
      console.log(`  - ${perm.resource}.${perm.action}: ${perm.description} (ID: ${perm.id})`);
    });

  } catch (error) {
    console.error("❌ Error:", error);
  }
}

// Run the test
testPermissions()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
import { $Enums } from "@/lib/generated/prisma";
import prisma from "../lib/prisma";

async function main() {
  // Seed original admin
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

  console.log("Admin seeded successfully");

  // Define all possible permissions
  const permissions = [
    // User Management
    { resource: "users", action: "create", description: "Create new users" },
    { resource: "users", action: "read", description: "View user information" },
    { resource: "users", action: "update", description: "Update user details" },
    { resource: "users", action: "delete", description: "Delete users" },
    
    // Role Management
    { resource: "roles", action: "create", description: "Create new roles" },
    { resource: "roles", action: "read", description: "View role information" },
    { resource: "roles", action: "update", description: "Update role permissions" },
    { resource: "roles", action: "delete", description: "Delete roles" },
    
    // Product Management
    { resource: "products", action: "create", description: "Add new products" },
    { resource: "products", action: "read", description: "View product catalog" },
    { resource: "products", action: "update", description: "Update product details" },
    { resource: "products", action: "delete", description: "Remove products" },
    
    // Order Management (no delete option)
    { resource: "orders", action: "create", description: "Create new orders" },
    { resource: "orders", action: "read", description: "View order information" },
    { resource: "orders", action: "update", description: "Update order status" },
    
    // Client Management
    { resource: "clients", action: "create", description: "Add new clients" },
    { resource: "clients", action: "read", description: "View client information" },
    { resource: "clients", action: "update", description: "Update client details" },
    { resource: "clients", action: "delete", description: "Remove clients" },
    
    // Company Management
    { resource: "companies", action: "create", description: "Add new companies" },
    { resource: "companies", action: "read", description: "View company information" },
    { resource: "companies", action: "update", description: "Update company settings" },
    { resource: "companies", action: "delete", description: "Remove companies" },
    
    // Inventory Management (no delete option)
    { resource: "inventory", action: "create", description: "Add inventory items" },
    { resource: "inventory", action: "read", description: "View inventory information" },
    { resource: "inventory", action: "update", description: "Update inventory details" },
  ];

  // Seed permissions
  for (const permission of permissions) {
    await prisma.systemPermission.upsert({
      where: { 
        resource_action: { 
          resource: permission.resource, 
          action: permission.action 
        }
      },
      update: { description: permission.description },
      create: permission,
    });
  }

  console.log("Permissions seeded successfully");
}

main().catch(console.error).finally(() => process.exit());
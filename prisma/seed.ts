import {
  PrismaClient,
  Role,
  Status,
  Modes,
  OMPoStatus,
  OMDispatchStatus,
  Reason,
} from "../lib/generated/prisma";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("temp-password", 10);

  // 1. Admin
  await prisma.admin.upsert({
    where: { email: "testmailsereno@gmail.com" },
    update: {},
    create: {
      email: "testmailsereno@gmail.com",
      password: hashedPassword,
      name: "Super Admin",
      role: Role.ADMIN,
    },
  });

  // 2. Companies
  const orgConfigs = [
    { name: "PepsiCo", address: "Purchase, New York, US" },
    { name: "Munch", address: "Zürich, Switzerland" },
    { name: "Kia Motors", address: "Seoul, South Korea" },
    { name: "Fitplay HQ", address: "Indiranagar, Bangalore" },
    { name: "Generic Corp", address: "Downtown, City" },
  ];

  const companies = [];
  for (const org of orgConfigs) {
    // Companies don't have a unique name in schema, but for seeding we'll find or create
    let company = await prisma.company.findFirst({ where: { name: org.name } });
    if (!company) {
      company = await prisma.company.create({
        data: {
          name: org.name,
          address: org.address,
        },
      });
    }
    companies.push(company);
  }

  // 3. Product Categories
  const categoryNames = [
    "Beverages",
    "Snacks",
    "Automotive",
    "Merchandise",
    "Stationery",
  ];
  const shortCodes = ["BEV", "SNAK", "AUTO", "MERCH", "STAT"];
  const categories = [];
  for (let i = 0; i < categoryNames.length; i++) {
    const category = await prisma.productCategory.upsert({
      where: { name: categoryNames[i] },
      update: {},
      create: {
        name: categoryNames[i],
        displayName: categoryNames[i],
        shortCode: shortCodes[i],
        description: `All your ${categoryNames[i].toLowerCase()} items`,
      },
    });
    categories.push(category);
  }

  // 4. Products
  const productConfigs = [
    { name: "Pepsi 500ml", catIdx: 0, price: 40, sku: "BEV-PEP-500" },
    { name: "Munch Chocolate", catIdx: 1, price: 20, sku: "SNAK-MUN-CH" },
    { name: "Kia Seltos Keychain", catIdx: 2, price: 150, sku: "AUTO-KIA-KC" },
    { name: "Corporate Hoodie", catIdx: 3, price: 1200, sku: "MERCH-HOOD" },
    { name: "Branded Notebook", catIdx: 4, price: 300, sku: "STAT-NB" },
  ];

  const products = [];
  for (const p of productConfigs) {
    const product = await prisma.product.upsert({
      where: { sku: p.sku },
      update: {
        name: p.name,
        price: p.price,
        availableStock: 500,
        categoryId: categories[p.catIdx].id,
      },
      create: {
        name: p.name,
        sku: p.sku,
        price: p.price,
        availableStock: 500,
        description: `High quality ${p.name}`,
        categoryId: categories[p.catIdx].id,
      },
    });
    products.push(product);
  }

  // 5. Clients
  const clients = [];
  const clientEmails = [
    "pepsi_admin@example.com",
    "munch_rep@example.com",
    "kia_ops@example.com",
    "client@example.com",
    "test_user@example.com",
  ];
  for (let i = 0; i < clientEmails.length; i++) {
    const client = await prisma.client.upsert({
      where: { email: clientEmails[i] },
      update: {
        companyID: companies[i].id,
      },
      create: {
        name: `${companies[i].name} User`,
        email: clientEmails[i],
        password: hashedPassword,
        phone: `900000000${i}`,
        address: `Office of ${companies[i].name}`,
        companyID: companies[i].id,
        role: Role.CLIENT,
      },
    });
    clients.push(client);
  }

  // 6. Orders (Simple create, collision risk low with random names but let's just create)
  // For repeatability, we'll check if any orders exist for the client first
  for (let i = 0; i < 5; i++) {
    const existingOrder = await prisma.order.findFirst({
      where: { consigneeName: `Manager ${i + 1}` },
    });
    if (!existingOrder) {
      await prisma.order.create({
        data: {
          totalAmount: 1000 * (i + 1),
          consigneeName: `Manager ${i + 1}`,
          deliveryAddress: `Hub ${i + 1}, Logistics Park`,
          requiredByDate: new Date(),
          clientId: clients[i % clients.length].id,
          orderItems: {
            create: {
              productId: products[i % products.length].id,
              quantity: 10,
              price: products[i % products.length].price || 0,
            },
          },
        },
      });
    }
  }

  // 7. Order Management (OM) Models
  const omOrgs = [
    "Pepsi India",
    "Munch Global",
    "Kia Regional Hub",
    "Fitplay OM",
    "Vendor Express",
  ];
  const omClients = [];
  const omLocations = [];
  const omProducts = [];
  const logisticsPartners = [];

  for (let i = 0; i < 5; i++) {
    let omC = await prisma.oMClient.findFirst({ where: { name: omOrgs[i] } });
    if (!omC) omC = await prisma.oMClient.create({ data: { name: omOrgs[i] } });

    let omL = await prisma.oMDeliveryLocation.findFirst({
      where: { name: `Center ${i + 1}, ${omOrgs[i]}` },
    });
    if (!omL)
      omL = await prisma.oMDeliveryLocation.create({
        data: { name: `Center ${i + 1}, ${omOrgs[i]}` },
      });

    const omP = await prisma.oMProduct.upsert({
      where: { sku: `OM-SKU-${omOrgs[i].substring(0, 3).toUpperCase()}-${i}` },
      update: { price: 50 * (i + 1) },
      create: {
        name: `${omOrgs[i]} Component X${i}`,
        sku: `OM-SKU-${omOrgs[i].substring(0, 3).toUpperCase()}-${i}`,
        price: 50 * (i + 1),
        defaultGstPct: 18,
      },
    });

    let logP = await prisma.oMLogisticsPartner.findFirst({
      where: { name: `Logistics ${i + 1}: ${omOrgs[i]}` },
    });
    if (!logP)
      logP = await prisma.oMLogisticsPartner.create({
        data: { name: `Logistics ${i + 1}: ${omOrgs[i]}` },
      });

    omClients.push(omC);
    omLocations.push(omL);
    omProducts.push(omP);
    logisticsPartners.push(logP);
  }

  // 8. OMPurchaseOrders & OMDispatchOrders with Varied Statuses
  const statuses = [
    OMPoStatus.CONFIRMED, // 0: Just Confirmed
    OMPoStatus.PARTIALLY_DISPATCHED, // 1: Partial
    OMPoStatus.FULLY_DISPATCHED, // 2: Full
    OMPoStatus.PARTIALLY_DISPATCHED, // 3: Partial
    OMPoStatus.CONFIRMED, // 4: Confirmed
  ];

  for (let i = 0; i < 5; i++) {
    const po = await prisma.oMPurchaseOrder.upsert({
      where: { poNumber: `PO-STATUS-2026-${i + 1}` },
      update: { status: statuses[i] },
      create: {
        clientId: omClients[i].id,
        locationId: omLocations[i].id,
        estimateNumber: `EST-STATUS-2026-${i + 1}`,
        estimateDate: new Date(),
        poNumber: `PO-STATUS-2026-${i + 1}`,
        poDate: new Date(),
        poReceivedDate: new Date(),
        status: statuses[i],
        grandTotal: 10000 * (i + 1),
        items: {
          create: {
            productId: omProducts[i].id,
            quantity: 100,
            rate: omProducts[i].price || 50,
            amount: (omProducts[i].price || 50) * 100,
            gstPercentage: 18,
            gstAmount: (omProducts[i].price || 50) * 100 * 0.18,
            totalAmount: (omProducts[i].price || 50) * 100 * 1.18,
          },
        },
      },
      include: { items: true },
    });

    // Create Dispatch Order logic based on PO status
    if (statuses[i] === OMPoStatus.PARTIALLY_DISPATCHED) {
      await prisma.oMDispatchOrder.upsert({
        where: { invoiceNumber: `INV-PARTIAL-${i + 100}` },
        update: { status: OMDispatchStatus.DISPATCHED },
        create: {
          purchaseOrderId: po.id,
          invoiceNumber: `INV-PARTIAL-${i + 100}`,
          invoiceDate: new Date(),
          logisticsPartnerId: logisticsPartners[i].id,
          docketNumber: `DOCKET-P-${i + 500}`,
          expectedDeliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          status: OMDispatchStatus.DISPATCHED,
          items: {
            create: {
              purchaseOrderItemId: po.items[0].id,
              quantity: 40,
              rate: po.items[0].rate,
              amount: po.items[0].rate * 40,
              gstPercentage: 18,
              gstAmount: po.items[0].rate * 40 * 0.18,
              totalAmount: po.items[0].rate * 40 * 1.18,
            },
          },
        },
      });
    } else if (statuses[i] === OMPoStatus.FULLY_DISPATCHED) {
      await prisma.oMDispatchOrder.upsert({
        where: { invoiceNumber: `INV-FULL-${i + 200}` },
        update: { status: OMDispatchStatus.DELIVERED },
        create: {
          purchaseOrderId: po.id,
          invoiceNumber: `INV-FULL-${i + 200}`,
          invoiceDate: new Date(),
          logisticsPartnerId: logisticsPartners[i].id,
          docketNumber: `DOCKET-F-${i + 600}`,
          expectedDeliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          status: OMDispatchStatus.DELIVERED,
          items: {
            create: {
              purchaseOrderItemId: po.items[0].id,
              quantity: 100,
              rate: po.items[0].rate,
              amount: po.items[0].rate * 100,
              gstPercentage: 18,
              gstAmount: po.items[0].rate * 100 * 0.18,
              totalAmount: po.items[0].rate * 100 * 1.18,
            },
          },
        },
      });
    }
  }

  // 9. System Roles & Permissions
  const resources = ["users", "products", "orders", "clients", "companies"];
  const permissions = [];
  for (const res of resources) {
    const perm = await prisma.systemPermission.upsert({
      where: { resource_action: { resource: res, action: "read" } },
      update: {},
      create: {
        resource: res,
        action: "read",
        description: `Can read ${res}`,
      },
    });
    permissions.push(perm);
  }

  for (let i = 0; i < 5; i++) {
    await prisma.systemRole.upsert({
      where: { name: `System ${companies[i].name} Admin` },
      update: {},
      create: {
        name: `System ${companies[i].name} Admin`,
        description: `Admin for ${companies[i].name} internal portal`,
        permissions: {
          connect: permissions.map((p) => ({ id: p.id })),
        },
      },
    });
  }

  console.log("Seed data updated successfully with varied PO statuses!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

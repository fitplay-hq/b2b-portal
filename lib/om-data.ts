import prisma from "@/lib/prisma";
import {
  OMDashboardPO,
  OMDashboardDispatch,
  OMPurchaseOrder,
  OMDispatchOrder,
  OMPurchaseOrderItem,
  OMDispatchOrderItem,
  OMPoStatus,
  OMBrand,
  OMClient,
  OMProduct,
} from "@/types/order-management";
import { type ComboboxOption } from "@/components/ui/combobox";

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface GetOMDashboardDataParams {
  query?: string;
  fromDate?: string;
  toDate?: string;
  clientName?: string;
  itemName?: string;
  brandName?: string;
  poNumber?: string;
  invoiceNumber?: string;
  logisticsPartnerId?: string;
  locationId?: string;
  statuses?: string[];
  sku?: string;
  docketNumber?: string;
  minAmount?: string;
  maxAmount?: string;
  gstPercentage?: string;
  timeRange?: string; // "today", "7d", "30d", "all"
}

export async function getOMDashboardData(params: GetOMDashboardDataParams) {
  const {
    query = "",
    fromDate,
    toDate,
    clientName,
    itemName,
    brandName,
    poNumber,
    invoiceNumber,
    logisticsPartnerId,
    locationId,
    statuses = [],
    sku,
    docketNumber,
    minAmount,
    maxAmount,
    gstPercentage,
    timeRange = "all",
  } = params;

  const andFilters: any[] = [];

  // Handle timeRange first for base filtering
  if (timeRange !== "all") {
    const now = new Date();
    const rangeStart = new Date();
    if (timeRange === "today") rangeStart.setHours(0, 0, 0, 0);
    else if (timeRange === "7d") rangeStart.setDate(now.getDate() - 7);
    else if (timeRange === "30d") rangeStart.setDate(now.getDate() - 30);

    andFilters.push({
      OR: [
        { poDate: { gte: rangeStart } },
        { estimateDate: { gte: rangeStart } },
      ],
    });
  }

  if (query) {
    const orFilters: any[] = [
      { poNumber: { contains: query, mode: "insensitive" } },
      { estimateNumber: { contains: query, mode: "insensitive" } },
      { client: { name: { contains: query, mode: "insensitive" } } },
      {
        deliveryLocations: {
          some: {
            name: { contains: query, mode: "insensitive" },
          },
        },
      },
      {
        dispatchOrders: {
          some: {
            OR: [
              { invoiceNumber: { contains: query, mode: "insensitive" } },
              { docketNumber: { contains: query, mode: "insensitive" } },
              {
                logisticsPartner: {
                  name: { contains: query, mode: "insensitive" },
                },
              },
            ],
          },
        },
      },
      {
        items: {
          some: {
            OR: [
              { product: { sku: { contains: query, mode: "insensitive" } } },
              { product: { name: { contains: query, mode: "insensitive" } } },
              { OMBrand: { name: { contains: query, mode: "insensitive" } } },
              {
                product: {
                  brands: {
                    some: {
                      name: { contains: query, mode: "insensitive" },
                    },
                  },
                },
              },
            ],
          },
        },
      },
    ];

    const numericQuery = parseFloat(query);
    if (!isNaN(numericQuery)) {
      orFilters.push(
        { totalGst: numericQuery },
        { grandTotal: numericQuery },
        {
          items: {
            some: {
              OR: [
                { rate: numericQuery },
                { amount: numericQuery },
                { gstPercentage: numericQuery },
              ],
            },
          },
        },
      );
    }
    andFilters.push({ OR: orFilters });
  }

  if (fromDate || toDate) {
    const dateFilter: any = {};
    if (fromDate) dateFilter.gte = new Date(fromDate);
    if (toDate) {
      const endOfDay = new Date(toDate);
      endOfDay.setHours(23, 59, 59, 999);
      dateFilter.lte = endOfDay;
    }
    andFilters.push({
      OR: [{ poDate: dateFilter }, { estimateDate: dateFilter }],
    });
  }

  if (clientName) {
    andFilters.push({
      client: { name: { contains: clientName, mode: "insensitive" } },
    });
  }

  if (itemName) {
    andFilters.push({
      items: {
        some: {
          product: { name: { contains: itemName, mode: "insensitive" } },
        },
      },
    });
  }

  if (brandName) {
    andFilters.push({
      items: {
        some: {
          OR: [
            { OMBrand: { name: { contains: brandName, mode: "insensitive" } } },
            {
              product: {
                brands: {
                  some: { name: { contains: brandName, mode: "insensitive" } },
                },
              },
            },
          ],
        },
      },
    });
  }

  if (poNumber) {
    andFilters.push({ poNumber: { contains: poNumber, mode: "insensitive" } });
  }

  if (invoiceNumber) {
    andFilters.push({
      dispatchOrders: {
        some: { invoiceNumber: { contains: invoiceNumber, mode: "insensitive" } },
      },
    });
  }

  if (logisticsPartnerId) {
    andFilters.push({
      dispatchOrders: { some: { logisticsPartnerId: logisticsPartnerId } },
    });
  }

  if (locationId) {
    andFilters.push({
      deliveryLocations: { some: { id: locationId } },
    });
  }

  if (sku) {
    andFilters.push({
      items: {
        some: { product: { sku: { contains: sku, mode: "insensitive" } } },
      },
    });
  }

  if (docketNumber) {
    andFilters.push({
      dispatchOrders: {
        some: { docketNumber: { contains: docketNumber, mode: "insensitive" } },
      },
    });
  }

  if (gstPercentage) {
    andFilters.push({
      items: { some: { gstPercentage: parseFloat(gstPercentage) } },
    });
  }

  if (minAmount || maxAmount) {
    const amountFilter: any = {};
    if (minAmount) amountFilter.gte = parseFloat(minAmount);
    if (maxAmount) amountFilter.lte = parseFloat(maxAmount);
    andFilters.push({ grandTotal: amountFilter });
  }

  if (statuses.length > 0) {
    andFilters.push({ status: { in: statuses as any[] } });
  }

  const whereClause = andFilters.length > 0 ? { AND: andFilters } : {};

  const purchaseOrdersRaw = await prisma.oMPurchaseOrder.findMany({
    where: whereClause,
    include: {
      client: true,
      deliveryLocations: true,
      items: {
        include: {
          product: { include: { brands: true } },
          dispatchItems: true,
          OMBrand: true,
        },
      },
      dispatchOrders: {
        include: {
          logisticsPartner: true,
          items: {
            include: {
              purchaseOrderItem: {
                include: {
                  product: { include: { brands: true } },
                  OMBrand: true,
                },
              },
            },
          },
        },
      },
    },
    take: query || andFilters.length > 0 ? 50 : 50,
    orderBy: { createdAt: "desc" },
  });

  // Transform to OMDashboardPO and OMDashboardDispatch
  const pos: OMDashboardPO[] = purchaseOrdersRaw.map((po: any) => ({
    id: po.id,
    clientId: po.clientId,
    clientName: po.client?.name || "Unknown",
    deliveryLocations: po.deliveryLocations?.map((l: any) => l.name) || [],
    estimateNumber: po.estimateNumber,
    estimateDate: po.estimateDate?.toISOString(),
    poNumber: po.poNumber,
    poDate: po.poDate?.toISOString(),
    poReceivedDate: po.poReceivedDate?.toISOString(),
    totalQuantity: po.items?.reduce((sum: number, item: any) => sum + item.quantity, 0) || 0,
    subtotal: po.items?.reduce((sum: number, item: any) => sum + item.amount, 0) || 0,
    totalGst: po.totalGst,
    grandTotal: po.grandTotal,
    status: po.status as OMPoStatus,
    lineItems: po.items?.map((item: any) => ({
      id: item.id,
      itemId: item.productId,
      itemName: item.product?.name || "Unknown",
      itemSku: item.product?.sku || null,
      quantity: item.quantity,
      rate: item.rate,
      amount: item.amount,
      gstPercentage: item.gstPercentage,
      gstAmount: item.gstAmount,
      totalAmount: item.totalAmount,
      brandName: item.OMBrand?.name || item.product?.brands?.[0]?.name || null,
    })) || [],
  }));

  const dispatches: OMDashboardDispatch[] = [];
  purchaseOrdersRaw.forEach((po: any) => {
    po.dispatchOrders?.forEach((d: any) => {
      dispatches.push({
        id: d.id,
        poId: po.id,
        poNumber: po.poNumber,
        clientId: po.clientId,
        clientName: po.client?.name || "Unknown",
        invoiceNumber: d.invoiceNumber,
        invoiceDate: d.invoiceDate?.toISOString(),
        dispatchDate: d.dispatchDate?.toISOString(),
        docketNumber: d.docketNumber || "",
        totalDispatchQty: d.items?.reduce((sum: number, i: any) => sum + i.quantity, 0) || 0,
        logisticsPartnerName: d.logisticsPartner?.name || "Logistics Partner",
        status: d.status,
        lineItems: d.items?.map((i: any) => ({
          poLineItemId: i.purchaseOrderItemId,
          dispatchQty: i.quantity,
          itemName: i.purchaseOrderItem?.product?.name || "Unknown",
          itemSku: i.purchaseOrderItem?.product?.sku || null,
          brandName: i.brandName || i.purchaseOrderItem?.OMBrand?.name || i.purchaseOrderItem?.product?.brands?.[0]?.name || null,
        })) || [],
      });
    });
  });

  return { pos, dispatches };
}

export async function getOMStaticOptions() {
  const [clients, products, brands, logistics, locations] = await Promise.all([
    prisma.oMClient.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true }, take: 50 }),
    prisma.oMProduct.findMany({ where: { isActive: true }, orderBy: { name: "asc" }, include: { brands: true }, take: 50 }),
    prisma.oMBrand.findMany({ orderBy: { name: "asc" }, take: 50 }),
    prisma.oMLogisticsPartner.findMany({ orderBy: { name: "asc" }, take: 50 }),
    prisma.oMDeliveryLocation.findMany({ orderBy: { name: "asc" }, take: 50 }),
  ]);

  return {
    clientOptions: clients.map(c => ({ value: c.name, label: c.name })),
    itemOptions: products.map(p => ({ value: p.name, label: p.name })),
    brandOptions: brands.map(b => ({ value: b.name, label: b.name })),
    logisticsOptions: logistics.map(l => ({ value: l.id, label: l.name })),
    locationOptions: locations.map(l => ({ value: l.id, label: l.name })),
    products, 
  };
}

export async function getOMBrands(params: {
  page?: number;
  limit?: number;
  search?: string;
} = {}): Promise<PaginatedResponse<OMBrand>> {
  const page = params.page || 1;
  const limit = params.limit || 50;
  const skip = (page - 1) * limit;
  const search = params.search || "";

  const where = search 
    ? { name: { contains: search, mode: "insensitive" as const } } 
    : {};

  const [brands, total] = await Promise.all([
    prisma.oMBrand.findMany({
      where,
      orderBy: { name: "asc" },
      skip,
      take: limit,
    }),
    prisma.oMBrand.count({ where }),
  ]);

  const data = brands.map((b) => ({
    ...b,
    createdAt: b.createdAt.toISOString(),
    updatedAt: b.updatedAt.toISOString(),
  })) as OMBrand[];

  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getOMClients(params: {
  page?: number;
  limit?: number;
  search?: string;
} = {}): Promise<PaginatedResponse<OMClient>> {
  const page = params.page || 1;
  const limit = params.limit || 50;
  const skip = (page - 1) * limit;
  const search = params.search || "";

  const where = search 
    ? { 
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { email: { contains: search, mode: "insensitive" as const } },
          { gstNumber: { contains: search, mode: "insensitive" as const } },
          { contactPerson: { contains: search, mode: "insensitive" as const } },
        ]
      } 
    : {};

  const [clients, total] = await Promise.all([
    prisma.oMClient.findMany({
      where,
      orderBy: { name: "asc" },
      skip,
      take: limit,
    }),
    prisma.oMClient.count({ where }),
  ]);

  const data = clients.map((c) => ({
    ...c,
    createdAt: c.createdAt?.toISOString(),
    updatedAt: c.updatedAt?.toISOString(),
  })) as OMClient[];

  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getOMProducts(params: {
  page?: number;
  limit?: number;
  search?: string;
  brandId?: string;
} = {}): Promise<PaginatedResponse<OMProduct>> {
  const page = params.page || 1;
  const limit = params.limit || 50;
  const skip = (page - 1) * limit;
  const search = params.search || "";

  const where: any = { isActive: true };
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" as const } },
      { sku: { contains: search, mode: "insensitive" as const } },
    ];
  }
  if (params.brandId) {
    where.brands = { some: { id: params.brandId } };
  }

  const [products, total] = await Promise.all([
    prisma.oMProduct.findMany({
      where,
      include: {
        brands: true,
        purchaseOrderItems: {
          select: { quantity: true },
        },
      },
      orderBy: { name: "asc" },
      skip,
      take: limit,
    }),
    prisma.oMProduct.count({ where }),
  ]);

  const data = products.map(({ purchaseOrderItems, brands, ...rest }) => ({
    ...rest,
    createdAt: rest.createdAt.toISOString(),
    updatedAt: rest.updatedAt.toISOString(),
    brands: brands.map((b) => ({
      ...b,
      createdAt: b.createdAt.toISOString(),
      updatedAt: b.updatedAt.toISOString(),
    })),
    totalOrdered: purchaseOrderItems.reduce(
      (sum, item) => sum + item.quantity,
      0,
    ),
  })) as any as OMProduct[];

  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getOMDispatches(params: {
  page?: number;
  limit?: number;
  search?: string;
  clientId?: string;
  status?: string;
  fromDate?: string;
  toDate?: string;
  purchaseOrderId?: string;
  logisticsPartnerId?: string;
  deliveryLocationId?: string;
  sortBy?: string;
} = {}): Promise<PaginatedResponse<OMDispatchOrder>> {
  const page = params.page || 1;
  const limit = params.limit || 50;
  const skip = (page - 1) * limit;
  const search = params.search || "";

  const andFilters: any[] = [];
  if (search) {
    andFilters.push({
      OR: [
        { invoiceNumber: { contains: search, mode: "insensitive" as const } },
        { docketNumber: { contains: search, mode: "insensitive" as const } },
        { purchaseOrder: { poNumber: { contains: search, mode: "insensitive" as const } } },
        { purchaseOrder: { client: { name: { contains: search, mode: "insensitive" as const } } } },
      ],
    });
  }
  if (params.clientId) andFilters.push({ purchaseOrder: { clientId: params.clientId } });
  if (params.status && params.status !== "all") andFilters.push({ deliveryStatus: params.status });
  if (params.purchaseOrderId) andFilters.push({ purchaseOrderId: params.purchaseOrderId });
  if (params.logisticsPartnerId) andFilters.push({ logisticsPartnerId: params.logisticsPartnerId });
  if (params.deliveryLocationId) andFilters.push({ deliveryLocationId: params.deliveryLocationId });

  if (params.fromDate || params.toDate) {
    const dateFilter: any = {};
    if (params.fromDate) dateFilter.gte = new Date(params.fromDate);
    if (params.toDate) {
      const endOfDay = new Date(params.toDate);
      endOfDay.setHours(23, 59, 59, 999);
      dateFilter.lte = endOfDay;
    }
    andFilters.push({ dispatchDate: dateFilter });
  }

  const where = andFilters.length > 0 ? { AND: andFilters } : {};

  let orderBy: any = { createdAt: "desc" };
  if (params.sortBy) {
    const [field, order] = params.sortBy.split("_");
    const direction = order === "asc" ? "asc" : "desc";
    if (field === "date" || field === "dispatch") orderBy = { dispatchDate: direction };
    else if (field === "invoice") orderBy = { invoiceNumber: direction };
    else if (field === "created") orderBy = { createdAt: direction };
  }

  const [dispatches, total] = await Promise.all([
    prisma.oMDispatchOrder.findMany({
      where,
      include: {
        purchaseOrder: {
          include: {
            client: true,
            deliveryLocations: true,
          },
        },
        logisticsPartner: true,
        deliveryLocation: true,
        items: {
          include: {
            purchaseOrderItem: {
              include: { product: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.oMDispatchOrder.count({ where }),
  ]);

  const data = dispatches.map((d) => ({
    ...d,
    invoiceDate: d.invoiceDate?.toISOString() || null,
    expectedDeliveryDate: d.expectedDeliveryDate?.toISOString() || null,
    dispatchDate: d.dispatchDate?.toISOString() || null,
    deliveryDate: d.deliveryDate?.toISOString() || null,
    createdAt: d.createdAt.toISOString(),
    updatedAt: d.updatedAt.toISOString(),
    purchaseOrder: d.purchaseOrder
      ? {
          ...d.purchaseOrder,
          poDate: d.purchaseOrder.poDate?.toISOString() || null,
          createdAt: d.purchaseOrder.createdAt.toISOString(),
          updatedAt: d.purchaseOrder.updatedAt.toISOString(),
          client: d.purchaseOrder.client
            ? {
                ...d.purchaseOrder.client,
                createdAt: d.purchaseOrder.client.createdAt.toISOString(),
                updatedAt: d.purchaseOrder.client.updatedAt.toISOString(),
              }
            : null,
        }
      : null,
    logisticsPartner: d.logisticsPartner
      ? {
          ...d.logisticsPartner,
          createdAt: d.logisticsPartner.createdAt.toISOString(),
          updatedAt: d.logisticsPartner.updatedAt.toISOString(),
        }
      : null,
  })) as any as OMDispatchOrder[];

  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getOMLogisticsPartners(params: {
  page?: number;
  limit?: number;
  search?: string;
} = {}): Promise<PaginatedResponse<any>> {
  const page = params.page || 1;
  const limit = params.limit || 50;
  const skip = (page - 1) * limit;
  const search = params.search || "";

  const where = search 
    ? { 
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { contactPerson: { contains: search, mode: "insensitive" as const } },
          { email: { contains: search, mode: "insensitive" as const } },
        ]
      } 
    : {};

  const [partners, total] = await Promise.all([
    prisma.oMLogisticsPartner.findMany({
      where,
      orderBy: { name: "asc" },
      skip,
      take: limit,
    }),
    prisma.oMLogisticsPartner.count({ where }),
  ]);

  const data = partners.map((p) => ({
    ...p,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }));

  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getOMDispatchOptions(type: "invoice" | "docket"): Promise<ComboboxOption[]> {
  if (type === "invoice") {
    const dispatches = await prisma.oMDispatchOrder.findMany({
      where: { invoiceNumber: { not: null } },
      select: { invoiceNumber: true },
      distinct: ["invoiceNumber"],
      orderBy: { invoiceNumber: "asc" },
    });
    return dispatches.map((d) => ({
      value: d.invoiceNumber!,
      label: d.invoiceNumber!,
    }));
  } else {
    const dispatches = await prisma.oMDispatchOrder.findMany({
      where: { docketNumber: { not: null } },
      select: { docketNumber: true },
      distinct: ["docketNumber"],
      orderBy: { docketNumber: "asc" },
    });
    return dispatches.map((d) => ({
      value: d.docketNumber!,
      label: d.docketNumber!,
    }));
  }
}

export async function getOMPurchaseOrders(params: {
  page?: number;
  limit?: number;
  search?: string;
  clientId?: string;
  status?: string;
  locationId?: string;
  fromDate?: string;
  toDate?: string;
  sortBy?: string;
} = {}): Promise<PaginatedResponse<OMPurchaseOrder>> {
  const page = params.page || 1;
  const limit = params.limit || 50;
  const skip = (page - 1) * limit;
  const search = params.search || "";

  const andFilters: any[] = [];
  if (search) {
    andFilters.push({
      OR: [
        { poNumber: { contains: search, mode: "insensitive" as const } },
        { estimateNumber: { contains: search, mode: "insensitive" as const } },
        { client: { name: { contains: search, mode: "insensitive" as const } } },
      ],
    });
  }
  if (params.clientId) andFilters.push({ clientId: params.clientId });
  if (params.status && params.status !== "all") andFilters.push({ status: params.status });
  if (params.locationId) {
    andFilters.push({
      deliveryLocations: { some: { id: params.locationId } },
    });
  }
  if (params.fromDate || params.toDate) {
    const dateFilter: any = {};
    if (params.fromDate) dateFilter.gte = new Date(params.fromDate);
    if (params.toDate) {
      const endOfDay = new Date(params.toDate);
      endOfDay.setHours(23, 59, 59, 999);
      dateFilter.lte = endOfDay;
    }
    andFilters.push({ poDate: dateFilter });
  }

  const where = andFilters.length > 0 ? { AND: andFilters } : {};

  let orderBy: any = { poDate: "desc" };
  if (params.sortBy) {
    const [field, order] = params.sortBy.split("_");
    const direction = order === "asc" ? "asc" : "desc";
    if (field === "po" && params.sortBy.includes("date")) orderBy = { poDate: direction };
    else if (field === "po" && params.sortBy.includes("number")) orderBy = { poNumber: direction };
    else if (field === "status") orderBy = { status: direction };
    else if (field === "created") orderBy = { createdAt: direction };
  }

  const [purchaseOrders, total] = await Promise.all([
    prisma.oMPurchaseOrder.findMany({
      where,
      include: {
        client: true,
        deliveryLocations: true,
        items: {
          include: {
            dispatchItems: true,
          },
        },
        dispatchOrders: {
          include: {
            items: true,
          },
        },
      },
      orderBy: { poDate: "desc" },
      skip,
      take: limit,
    }),
    prisma.oMPurchaseOrder.count({ where }),
  ]);

  const data = purchaseOrders.map((po) => ({
    ...po,
    poDate: po.poDate?.toISOString() || null,
    estimateDate: po.estimateDate?.toISOString() || null,
    poReceivedDate: po.poReceivedDate?.toISOString() || null,
    createdAt: po.createdAt.toISOString(),
    updatedAt: po.updatedAt.toISOString(),
    client: po.client
      ? {
          ...po.client,
          createdAt: po.client.createdAt.toISOString(),
          updatedAt: po.client.updatedAt.toISOString(),
        }
      : null,
    items: po.items.map((i) => ({
      ...i,
      createdAt: i.createdAt.toISOString(),
      updatedAt: i.updatedAt.toISOString(),
      dispatchItems: i.dispatchItems.map((d) => ({
        ...d,
        createdAt: d.createdAt.toISOString(),
        updatedAt: d.updatedAt.toISOString(),
      })),
    })),
  })) as any as OMPurchaseOrder[];

  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getOMPONumberOptions(): Promise<ComboboxOption[]> {
  const pos = await prisma.oMPurchaseOrder.findMany({
    where: { poNumber: { not: null } },
    select: { poNumber: true },
    distinct: ["poNumber"],
    orderBy: { poNumber: "asc" },
  });
  return pos.map((po) => ({
    value: po.poNumber!,
    label: po.poNumber!,
  }));
}

export async function getOMDeliveryLocations(params: {
  page?: number;
  limit?: number;
  search?: string;
} = {}): Promise<PaginatedResponse<any>> {
  const page = params.page || 1;
  const limit = params.limit || 50;
  const skip = (page - 1) * limit;
  const search = params.search || "";

  const where = search 
    ? { name: { contains: search, mode: "insensitive" as const } } 
    : {};

  const [locations, total] = await Promise.all([
    prisma.oMDeliveryLocation.findMany({
      where,
      orderBy: { name: "asc" },
      skip,
      take: limit,
    }),
    prisma.oMDeliveryLocation.count({ where }),
  ]);

  const data = locations.map((l) => ({
    ...l,
    createdAt: l.createdAt.toISOString(),
    updatedAt: l.updatedAt.toISOString(),
  }));

  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getOMTableCounts() {
  const [
    brands,
    clients,
    deliveryLocations,
    dispatches,
    products,
    logisticsPartners,
    purchaseOrders,
  ] = await Promise.all([
    prisma.oMBrand.count(),
    prisma.oMClient.count(),
    prisma.oMDeliveryLocation.count(),
    prisma.oMDispatchOrder.count(),
    prisma.oMProduct.count(),
    prisma.oMLogisticsPartner.count(),
    prisma.oMPurchaseOrder.count(),
  ]);

  return {
    brands,
    clients,
    deliveryLocations,
    dispatches,
    products,
    logisticsPartners,
    purchaseOrders,
  };
}

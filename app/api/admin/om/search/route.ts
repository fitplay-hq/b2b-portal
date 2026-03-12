import { NextRequest, NextResponse } from "next/server";
import { checkPermission } from "@/lib/auth-middleware";
import { RESOURCES } from "@/lib/utils";
import prisma from "@/lib/prisma";
import { handleApiError } from "@/lib/api-errors";

export async function GET(req: NextRequest) {
  try {
    const permissionCheck = await checkPermission(RESOURCES.ORDERS, "view");
    if (!permissionCheck.success) {
      return NextResponse.json(
        { error: permissionCheck.error },
        {
          status:
            permissionCheck.error === "Authentication required" ? 401 : 403,
        },
      );
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";
    const fromDate = searchParams.get("fromDate");
    const toDate = searchParams.get("toDate");
    const clientName = searchParams.get("clientName");
    const itemName = searchParams.get("itemName");
    const brandName = searchParams.get("brandName");
    const poNumber = searchParams.get("poNumber");
    const invoiceNumber = searchParams.get("invoiceNumber");
    const logisticsPartnerId = searchParams.get("logisticsPartnerId");
    const locationId = searchParams.get("locationId");
    const status = searchParams.get("status");
    const sku = searchParams.get("sku");
    const docketNumber = searchParams.get("docketNumber");
    const minAmount = searchParams.get("minAmount");
    const maxAmount = searchParams.get("maxAmount");
    const gstPercentage = searchParams.get("gstPercentage");

    const andFilters: any[] = [];

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

      // Handle numeric searches if query is a valid number
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
              {
                OMBrand: {
                  name: { contains: brandName, mode: "insensitive" },
                },
              },
              {
                product: {
                  brands: {
                    some: {
                      name: { contains: brandName, mode: "insensitive" },
                    },
                  },
                },
              },
            ],
          },
        },
      });
    }

    if (poNumber) {
      andFilters.push({
        poNumber: { contains: poNumber, mode: "insensitive" },
      });
    }

    if (invoiceNumber) {
      andFilters.push({
        dispatchOrders: {
          some: {
            invoiceNumber: { contains: invoiceNumber, mode: "insensitive" },
          },
        },
      });
    }

    if (logisticsPartnerId) {
      andFilters.push({
        dispatchOrders: {
          some: {
            logisticsPartnerId: logisticsPartnerId,
          },
        },
      });
    }

    if (locationId) {
      andFilters.push({
        deliveryLocations: {
          some: {
            id: locationId,
          },
        },
      });
    }

    if (sku) {
      andFilters.push({
        items: {
          some: {
            product: { sku: { contains: sku, mode: "insensitive" } },
          },
        },
      });
    }

    if (docketNumber) {
      andFilters.push({
        dispatchOrders: {
          some: {
            docketNumber: { contains: docketNumber, mode: "insensitive" },
          },
        },
      });
    }

    if (gstPercentage) {
      andFilters.push({
        items: {
          some: {
            gstPercentage: parseFloat(gstPercentage),
          },
        },
      });
    }

    if (minAmount || maxAmount) {
      const amountFilter: any = {};
      if (minAmount) amountFilter.gte = parseFloat(minAmount);
      if (maxAmount) amountFilter.lte = parseFloat(maxAmount);
      andFilters.push({ grandTotal: amountFilter });
    }

    if (status) {
      andFilters.push({ status });
    }

    const whereClause = andFilters.length > 0 ? { AND: andFilters } : {};

    const purchaseOrders = await prisma.oMPurchaseOrder.findMany({
      where: whereClause,
      include: {
        client: true,
        deliveryLocations: true,
        items: {
          include: {
            product: true,
            dispatchItems: true,
          },
        },
        dispatchOrders: {
          include: {
            logisticsPartner: true,
            items: {
              include: {
                purchaseOrderItem: {
                  include: {
                    product: true,
                  },
                },
              },
            },
          },
        },
      },
      take: query || andFilters.length > 0 ? 50 : 100,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ results: purchaseOrders });
  } catch (error: unknown) {
    return handleApiError(error);
  }
}

import { NextRequest, NextResponse } from "next/server";
import { checkPermission } from "@/lib/auth-middleware";
import { RESOURCES } from "@/lib/utils";
import prisma from "@/lib/prisma";
import { handleApiError } from "@/lib/api-errors";
import { OMPurchaseOrderCreateSchema } from "@/lib/validations/om";

export async function POST(req: NextRequest) {
  try {
    const permissionCheck = await checkPermission(RESOURCES.ORDERS, "create");
    if (!permissionCheck.success) {
      return NextResponse.json(
        { error: permissionCheck.error },
        {
          status:
            permissionCheck.error === "Authentication required" ? 401 : 403,
        },
      );
    }

    const body = await req.json();
    const validatedData = OMPurchaseOrderCreateSchema.parse(body);

    const {
      clientId,
      locationId,
      estimateNumber,
      estimateDate,
      poNumber,
      poDate,
      poReceivedDate,
      items,
    } = validatedData;

    // Auto-set status: DRAFT when no PO number, CONFIRMED otherwise
    const status = poNumber ? (validatedData.status ?? "CONFIRMED") : "DRAFT";

    // 1. Verify clientId exists
    const client = await prisma.oMClient.findUnique({
      where: { id: clientId },
    });
    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    // Verify locationId if provided
    if (locationId) {
      const location = await prisma.oMDeliveryLocation.findUnique({
        where: { id: locationId },
      });
      if (!location) {
        return NextResponse.json(
          { error: "Delivery Location not found" },
          { status: 404 },
        );
      }
    }

    // Verify uniqueness of poNumber (only when provided)
    if (poNumber) {
      const existingPoNumber = await prisma.oMPurchaseOrder.findUnique({
        where: { poNumber },
      });
      if (existingPoNumber) {
        return NextResponse.json(
          { error: "PO Number already exists" },
          { status: 400 },
        );
      }
    }

    // 3. Process items and calculate totals
    let totalGst = 0;
    let grandTotal = 0;

    const processedItems = items.map((item) => {
      const amount = item.quantity * item.rate;
      const gstAmount = amount * (item.gstPercentage / 100);
      const totalAmount = amount + gstAmount;

      totalGst += gstAmount;
      grandTotal += totalAmount;

      return {
        productId: item.productId,
        quantity: item.quantity,
        rate: item.rate,
        amount,
        gstPercentage: item.gstPercentage,
        gstAmount,
        totalAmount,
        brandId: item.brandId || null,
        description: item.description || null,
      };
    });

    // 4. Create PO and Items in a transaction
    const purchaseOrder = await prisma.$transaction(async (tx) => {
      const po = await tx.oMPurchaseOrder.create({
        data: {
          clientId,
          locationId: locationId || null,
          estimateNumber: estimateNumber || null,
          estimateDate: estimateDate ? new Date(estimateDate) : null,
          poNumber: poNumber || null,
          poDate: poDate ? new Date(poDate) : null,
          poReceivedDate: poReceivedDate ? new Date(poReceivedDate) : null,
          status,
          totalGst,
          grandTotal,
          items: {
            create: processedItems,
          },
        },
        include: {
          items: true,
        },
      });
      return po;
    });

    return NextResponse.json(
      {
        message: "Purchase Order created successfully",
        id: purchaseOrder.id,
        data: purchaseOrder,
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    return handleApiError(error);
  }
}

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
    const clientId = searchParams.get("clientId");
    const status = searchParams.get("status");
    const fromDate =
      searchParams.get("fromDate") || searchParams.get("startDate");
    const toDate = searchParams.get("toDate") || searchParams.get("endDate");
    const search = searchParams.get("search") || searchParams.get("q") || "";
    const poNumber = searchParams.get("poNumber");
    const locationId = searchParams.get("locationId");

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "999");
    const skip = (page - 1) * limit;

    const andFilters: any[] = [];

    if (search) {
      andFilters.push({
        OR: [
          { poNumber: { contains: search, mode: "insensitive" } },
          { estimateNumber: { contains: search, mode: "insensitive" } },
          { client: { name: { contains: search, mode: "insensitive" } } },
        ],
      });
    }

    if (clientId) {
      andFilters.push({ clientId });
    }

    if (poNumber) {
      andFilters.push({
        poNumber: { contains: poNumber, mode: "insensitive" },
      });
    }

    if (locationId) {
      andFilters.push({ locationId });
    }

    if (status) {
      if (status === "active") {
        andFilters.push({
          status: { in: ["CONFIRMED", "PARTIALLY_DISPATCHED"] },
        });
      } else if (status !== "all") {
        andFilters.push({ status });
      }
    }

    if (fromDate || toDate) {
      const dateFilter: any = {};
      if (fromDate) dateFilter.gte = new Date(fromDate);
      if (toDate) {
        const endOfDay = new Date(toDate);
        endOfDay.setHours(23, 59, 59, 999);
        dateFilter.lte = endOfDay;
      }
      andFilters.push({ poDate: dateFilter });
    }

    const whereClause = andFilters.length > 0 ? { AND: andFilters } : {};

    const [purchaseOrders, total] = await Promise.all([
      prisma.oMPurchaseOrder.findMany({
        where: whereClause,
        include: {
          client: true,
          deliveryLocation: true,
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
      prisma.oMPurchaseOrder.count({ where: whereClause }),
    ]);

    return NextResponse.json({
      data: purchaseOrders,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: unknown) {
    return handleApiError(error);
  }
}

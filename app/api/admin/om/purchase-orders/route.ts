import { NextRequest, NextResponse } from "next/server";
import { checkPermission } from "@/lib/auth-middleware";
import { RESOURCES } from "@/lib/utils";
import prisma from "@/lib/prisma";
import { handleApiError } from "@/lib/api-errors";
import { OMPurchaseOrderCreateSchema } from "@/lib/validations/om";
import { getOMPurchaseOrders } from "@/lib/om-data";

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
      deliveryLocationIds,
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

    // Verify deliveryLocationIds if provided
    if (deliveryLocationIds && deliveryLocationIds.length > 0) {
      const locations = await prisma.oMDeliveryLocation.findMany({
        where: { id: { in: deliveryLocationIds } },
      });
      if (locations.length !== deliveryLocationIds.length) {
        return NextResponse.json(
          { error: "One or more Delivery Locations not found" },
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
          deliveryLocations:
            deliveryLocationIds && deliveryLocationIds.length > 0
              ? { connect: deliveryLocationIds.map((id) => ({ id })) }
              : undefined,
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

    const { searchParams } = req.nextUrl;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const search = searchParams.get("search") || searchParams.get("q") || "";
    const clientId = searchParams.get("clientId") || undefined;
    const status = searchParams.get("status") || undefined;
    const fromDate = searchParams.get("fromDate") || searchParams.get("startDate") || undefined;
    const toDate = searchParams.get("toDate") || searchParams.get("endDate") || undefined;
    const locationId = searchParams.get("locationId") || undefined;

    const result = await getOMPurchaseOrders({
      page,
      limit,
      search,
      clientId,
      status,
      fromDate,
      toDate,
      locationId,
    });

    return NextResponse.json(result);
  } catch (error: unknown) {
    return handleApiError(error);
  }
}

import { NextRequest, NextResponse } from "next/server";
import { checkPermission } from "@/lib/auth-middleware";
import { RESOURCES } from "@/lib/utils";
import prisma from "@/lib/prisma";
import { handleApiError } from "@/lib/api-errors";
import { OMDispatchOrderCreateSchema } from "@/lib/validations/om";
import { OMPoStatus } from "@/lib/generated/prisma";
import { revalidatePath, revalidateTag } from "next/cache";
import { getOMDispatches } from "@/lib/om-data";

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
    const validatedData = OMDispatchOrderCreateSchema.parse(body);

    const {
      purchaseOrderId,
      invoiceNumber,
      invoiceDate,
      logisticsPartnerId,
      deliveryLocationId,
      docketNumber,
      expectedDeliveryDate,
      dispatchDate,
      deliveryDate,
      status,
      items,
      shipmentBoxes,
    } = validatedData;

    // 1. Verify Purchase Order exists and is not CLOSED
    const purchaseOrder = await prisma.oMPurchaseOrder.findUnique({
      where: { id: purchaseOrderId },
      include: { items: true },
    });

    if (!purchaseOrder) {
      return NextResponse.json(
        { error: "Purchase Order not found" },
        { status: 404 },
      );
    }

    if (purchaseOrder.status === OMPoStatus.CLOSED) {
      return NextResponse.json(
        { error: "Cannot dispatch against a CLOSED Purchase Order" },
        { status: 400 },
      );
    }

    // Validate that invoice date is not before PO date
    if (invoiceDate && purchaseOrder.poDate) {
      const invDateObj = new Date(invoiceDate);
      const poDateObj = new Date(purchaseOrder.poDate);
      
      // Normalize dates to start of day for accurate comparison if time isn't critical
      // Assuming exact timestamp comparison might be too strict, but let's do direct comparison first
      if (invDateObj < poDateObj) {
        return NextResponse.json(
          { error: "Invoice Date cannot be earlier than the Purchase Order Date." },
          { status: 400 },
        );
      }
    }

    // 2. Verify Logistics Partner exists if provided
    if (logisticsPartnerId) {
      const logisticsPartner = await prisma.oMLogisticsPartner.findUnique({
        where: { id: logisticsPartnerId },
      });

      if (!logisticsPartner) {
        return NextResponse.json(
          { error: "Logistics Partner not found" },
          { status: 404 },
        );
      }
    }

    // Verify Delivery Location exists if provided
    if (deliveryLocationId) {
      const deliveryLocation = await prisma.oMDeliveryLocation.findUnique({
        where: { id: deliveryLocationId },
      });

      if (!deliveryLocation) {
        return NextResponse.json(
          { error: "Delivery Location not found" },
          { status: 404 },
        );
      }
    }

    // 3. Validate fulfillment for each dispatch item
    const poItemMap = new Map(
      purchaseOrder.items.map((item) => [item.id, item]),
    );

    const poItemIds = items.map((i) => i.purchaseOrderItemId);
    const existingDispatches = await prisma.oMDispatchOrderItem.groupBy({
      by: ["purchaseOrderItemId"],
      where: { purchaseOrderItemId: { in: poItemIds } },
      _sum: { quantity: true },
    });

    const dispatchedMap = new Map(
      existingDispatches.map((d) => [
        d.purchaseOrderItemId,
        d._sum.quantity ?? 0,
      ]),
    );

    for (const item of items) {
      const poItem = poItemMap.get(item.purchaseOrderItemId);
      if (!poItem) {
        return NextResponse.json(
          {
            error: `Purchase Order Item '${item.purchaseOrderItemId}' does not belong to PO '${purchaseOrderId}'`,
          },
          { status: 400 },
        );
      }

      const previouslyDispatched =
        dispatchedMap.get(item.purchaseOrderItemId) ?? 0;
      const remaining = (poItem.quantity || 0) - previouslyDispatched;

      if (item.quantity > remaining) {
        return NextResponse.json(
          {
            error: `Dispatch quantity (${item.quantity}) exceeds remaining quantity (${remaining}) for PO item '${item.purchaseOrderItemId}'`,
          },
          { status: 400 },
        );
      }
    }

    // 4. Build dispatch items with computed amounts
    const processedItems = items.map((item) => {
      const amount = item.quantity * item.rate;
      const gstAmount = amount * (item.gstPercentage / 100);
      const totalAmount = amount + gstAmount;

      return {
        purchaseOrderItemId: item.purchaseOrderItemId,
        quantity: item.quantity,
        rate: item.rate,
        amount,
        gstPercentage: item.gstPercentage,
        gstAmount,
        totalAmount,
      };
    });

    // 5. Create Dispatch Order + Items and update PO status atomically
    const dispatchOrder = await prisma.$transaction(async (tx) => {
      const dispatch = await tx.oMDispatchOrder.create({
        data: {
          purchaseOrderId,
          invoiceNumber: invoiceNumber ? invoiceNumber.trim() : null,
          invoiceDate: invoiceDate ? new Date(invoiceDate) : null,
          logisticsPartnerId: logisticsPartnerId || null,
          deliveryLocationId: deliveryLocationId || null,
          docketNumber: docketNumber || null,
          expectedDeliveryDate: expectedDeliveryDate
            ? new Date(expectedDeliveryDate)
            : null,
          dispatchDate: dispatchDate
            ? new Date(dispatchDate)
            : null,
          deliveryDate: deliveryDate
            ? new Date(deliveryDate)
            : null,
          status,
          items: {
            create: processedItems,
          },
        },
        include: { items: true },
      });

      // 5.5. Create Shipment Boxes if provided
      if (shipmentBoxes && shipmentBoxes.length > 0) {
        for (const box of shipmentBoxes) {
          const createdBox = await tx.oMShipmentBox.create({
            data: {
              dispatchOrderId: dispatch.id,
              boxLabel: box.boxNumber?.toString() || "1",
              length: box.length,
              width: box.width,
              height: box.height,
              weight: box.weight || 0,
              numberOfBoxes: box.numberOfBoxes,
            },
          });

          // Create box contents
          for (const content of box.contents) {
            // Find the corresponding dispatch item we just created
            const dispatchItem = dispatch.items.find(
              (di) => di.purchaseOrderItemId === content.itemId,
            );

            if (dispatchItem) {
              await tx.oMShipmentBoxContent.create({
                data: {
                  shipmentBoxId: createdBox.id,
                  dispatchOrderItemId: dispatchItem.id,
                  quantityPerBox: content.quantity,
                },
              });
            }
          }
        }
      }

      // 6. Re-aggregate all dispatched quantities (including this new dispatch)
      //    to determine whether PO is fully or partially dispatched
      const allPoItemIds = purchaseOrder.items.map((i) => i.id);
      const updatedDispatches = await tx.oMDispatchOrderItem.groupBy({
        by: ["purchaseOrderItemId"],
        where: { purchaseOrderItemId: { in: allPoItemIds } },
        _sum: { quantity: true },
      });

      const updatedDispatchMap = new Map(
        updatedDispatches.map((d) => [
          d.purchaseOrderItemId,
          d._sum.quantity ?? 0,
        ]),
      );

      const fullyDispatched = purchaseOrder.items.every(
        (poItem) => (updatedDispatchMap.get(poItem.id) ?? 0) >= (poItem.quantity || 0),
      );

      const newStatus: OMPoStatus = fullyDispatched
        ? OMPoStatus.FULLY_DISPATCHED
        : OMPoStatus.PARTIALLY_DISPATCHED;

      await tx.oMPurchaseOrder.update({
        where: { id: purchaseOrderId },
        data: { status: newStatus },
      });

      return dispatch;
    });

    revalidateTag("om-dispatch-orders", "max");
    revalidateTag("om-purchase-orders", "max");
    revalidateTag("om-dashboard", "max");

    revalidatePath("/admin/order-management/dispatches");
    revalidatePath("/admin/order-management/purchase-orders");
    revalidatePath("/admin/dashboard");

    return NextResponse.json(
      {
        message: "Dispatch Order created successfully",
        id: dispatchOrder.id,
        data: dispatchOrder,
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
    const limit = parseInt(searchParams.get("limit") || "500");
    const search = searchParams.get("search") || searchParams.get("q") || "";
    const status = searchParams.get("status");
    const purchaseOrderId = searchParams.get("purchaseOrderId");
    const clientId = searchParams.get("clientId");
    const fromDate = searchParams.get("fromDate");
    const toDate = searchParams.get("toDate");
    const logisticsPartnerId = searchParams.get("logisticsPartnerId");
    const deliveryLocationId = searchParams.get("deliveryLocationId");
    const invoiceNumber = searchParams.get("invoiceNumber");

    const result = await getOMDispatches({
      page,
      limit,
      search,
      status: status || undefined,
      purchaseOrderId: purchaseOrderId || undefined,
      clientId: clientId || undefined,
      logisticsPartnerId: logisticsPartnerId || undefined,
      deliveryLocationId: deliveryLocationId || undefined,
      fromDate: fromDate || undefined,
      toDate: toDate || undefined,
    });

    return NextResponse.json(result);
  } catch (error: unknown) {
    return handleApiError(error);
  }
}

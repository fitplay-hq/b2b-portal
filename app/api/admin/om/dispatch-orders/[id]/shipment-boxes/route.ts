import { NextRequest, NextResponse } from "next/server";
import { checkPermission } from "@/lib/auth-middleware";
import { RESOURCES } from "@/lib/utils";
import prisma from "@/lib/prisma";
import { handleApiError } from "@/lib/api-errors";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { id: dispatchOrderId } = params;

    const shipmentBoxes = await prisma.oMShipmentBox.findMany({
      where: { dispatchOrderId },
      include: {
        contents: {
          include: {
            dispatchOrderItem: {
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
      orderBy: { createdAt: "asc" },
    });

    // Map to the requested interface format
    const formattedBoxes = shipmentBoxes.map((box) => ({
      boxId: box.id,
      boxNumber: box.boxLabel, // Using label as identifier
      length: box.length,
      width: box.width,
      height: box.height,
      numberOfBoxes: box.numberOfBoxes,
      contents: box.contents.map((c) => ({
        itemId: c.dispatchOrderItem.purchaseOrderItem.productId,
        itemName: c.dispatchOrderItem.purchaseOrderItem.product.name,
        quantity: c.quantityPerBox,
        dispatchOrderItemId: c.dispatchOrderItemId, // Keep for internal usage
      })),
    }));

    return NextResponse.json(formattedBoxes);
  } catch (error: unknown) {
    return handleApiError(error);
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const permissionCheck = await checkPermission(RESOURCES.ORDERS, "edit");
    if (!permissionCheck.success) {
      return NextResponse.json(
        { error: permissionCheck.error },
        {
          status:
            permissionCheck.error === "Authentication required" ? 401 : 403,
        },
      );
    }

    const { id: dispatchOrderId } = params;
    const body = await req.json();
    const { boxes } = body; 

    const dispatchOrder = await prisma.oMDispatchOrder.findUnique({
      where: { id: dispatchOrderId },
    });

    if (!dispatchOrder) {
      return NextResponse.json(
        { error: "Dispatch Order not found" },
        { status: 404 },
      );
    }

    await prisma.$transaction(async (tx) => {
      await tx.oMShipmentBox.deleteMany({
        where: { dispatchOrderId },
      });

      for (const box of boxes) {
        await tx.oMShipmentBox.create({
          data: {
            dispatchOrderId,
            boxLabel: box.boxNumber?.toString() || box.boxLabel,
            length: parseFloat(box.length),
            width: parseFloat(box.width),
            height: parseFloat(box.height),
            numberOfBoxes: parseInt(box.numberOfBoxes),
            contents: {
              create: box.contents.map((content: any) => ({
                dispatchOrderItemId: content.dispatchOrderItemId,
                quantityPerBox: parseInt(content.quantity),
              })),
            },
          },
        });
      }
    });

    return NextResponse.json({ message: "Shipment packing saved successfully" });
  } catch (error: unknown) {
    return handleApiError(error);
  }
}

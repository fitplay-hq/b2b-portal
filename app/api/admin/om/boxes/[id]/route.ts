import { NextRequest, NextResponse } from "next/server";
import { checkPermission } from "@/lib/auth-middleware";
import { RESOURCES } from "@/lib/utils";
import { handleApiError } from "@/lib/api-errors";
import { OMShipmentService } from "@/lib/services/om-shipment-service";

/**
 * PATCH /api/admin/om/boxes/[id]
 * Update shipment box details
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const permissionCheck = await checkPermission(RESOURCES.ORDERS, "edit");
    if (!permissionCheck.success) {
      return NextResponse.json(
        { error: permissionCheck.error },
        { status: permissionCheck.error === "Authentication required" ? 401 : 403 }
      );
    }

    const { id: boxId } = params;
    const body = await req.json();

    const data = await OMShipmentService.updateShipmentBox(boxId, body);

    return NextResponse.json({
      message: "Shipment box updated successfully",
      data
    });
  } catch (error: unknown) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/admin/om/boxes/[id]
 * Delete a shipment box and its contents
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const permissionCheck = await checkPermission(RESOURCES.ORDERS, "edit");
    if (!permissionCheck.success) {
      return NextResponse.json(
        { error: permissionCheck.error },
        { status: permissionCheck.error === "Authentication required" ? 401 : 403 }
      );
    }

    const { id: boxId } = params;

    await OMShipmentService.deleteShipmentBox(boxId);

    return NextResponse.json({ message: "Shipment box deleted successfully" });
  } catch (error: unknown) {
    return handleApiError(error);
  }
}

import { NextRequest, NextResponse } from "next/server";
import { checkPermission } from "@/lib/auth-middleware";
import { RESOURCES } from "@/lib/utils";
import { handleApiError } from "@/lib/api-errors";
import { OMShipmentService } from "@/lib/services/om-shipment-service";

/**
 * PATCH /api/admin/om/box-contents/[id]
 * Update quantity of an item in a box
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

    const { id: contentId } = params;
    const body = await req.json();

    const data = await OMShipmentService.updateBoxContent(contentId, body);

    return NextResponse.json({
      message: "Box content updated successfully",
      data
    });
  } catch (error: unknown) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/admin/om/box-contents/[id]
 * Remove an item from a box
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

    const { id: contentId } = params;

    await OMShipmentService.removeBoxContent(contentId);

    return NextResponse.json({ message: "Item removed from box successfully" });
  } catch (error: unknown) {
    return handleApiError(error);
  }
}

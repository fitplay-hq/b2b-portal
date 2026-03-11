import { NextRequest, NextResponse } from "next/server";
import { checkPermission } from "@/lib/auth-middleware";
import { RESOURCES } from "@/lib/utils";
import { handleApiError } from "@/lib/api-errors";
import { OMShipmentService } from "@/lib/services/om-shipment-service";

/**
 * POST /api/admin/om/boxes/[id]/contents
 * Add content items to a specific shipment box
 */
export async function POST(
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

    const data = await OMShipmentService.addBoxContent(boxId, body);

    return NextResponse.json({
      message: "Content added to box successfully",
      data
    }, { status: 201 });
  } catch (error: unknown) {
    return handleApiError(error);
  }
}

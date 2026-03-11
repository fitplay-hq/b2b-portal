import { NextRequest, NextResponse } from "next/server";
import { checkPermission } from "@/lib/auth-middleware";
import { RESOURCES } from "@/lib/utils";
import { handleApiError } from "@/lib/api-errors";
import { OMShipmentService } from "@/lib/services/om-shipment-service";
import { OMShipmentBoxCreateSchema } from "@/lib/validations/om";

/**
 * POST /api/admin/om/dispatch-orders/[id]/boxes
 * Add a new shipment box to a dispatch
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

    const { id: dispatchOrderId } = params;
    const body = await req.json();

    const data = await OMShipmentService.createShipmentBox(dispatchOrderId, body);

    return NextResponse.json({
      message: "Shipment box added successfully",
      data
    }, { status: 201 });
  } catch (error: unknown) {
    return handleApiError(error);
  }
}

/**
 * GET /api/admin/om/dispatch-orders/[id]/boxes
 * Fetch all shipment boxes for a dispatch
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const permissionCheck = await checkPermission(RESOURCES.ORDERS, "view");
    if (!permissionCheck.success) {
      return NextResponse.json(
        { error: permissionCheck.error },
        { status: permissionCheck.error === "Authentication required" ? 401 : 403 }
      );
    }

    const { id: dispatchOrderId } = params;

    const formattedBoxes = await OMShipmentService.getDispatchShipmentDetails(dispatchOrderId);

    return NextResponse.json(formattedBoxes);
  } catch (error: unknown) {
    return handleApiError(error);
  }
}

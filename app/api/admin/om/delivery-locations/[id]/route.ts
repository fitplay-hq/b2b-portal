import { NextRequest, NextResponse } from "next/server";
import { checkPermission } from "@/lib/auth-middleware";
import { RESOURCES } from "@/lib/utils";
import prisma from "@/lib/prisma";
import { handleApiError } from "@/lib/api-errors";
import { OMDeliveryLocationUpdateSchema } from "@/lib/validations/om";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const permissionCheck = await checkPermission(RESOURCES.ORDERS, "update");
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
    const validatedData = OMDeliveryLocationUpdateSchema.parse(body);

    const location = await prisma.oMDeliveryLocation.update({
      where: { id: params.id },
      data: validatedData,
    });

    return NextResponse.json(
      { message: "Delivery Location updated successfully", data: location },
      { status: 200 },
    );
  } catch (error: unknown) {
    return handleApiError(error);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const permissionCheck = await checkPermission(RESOURCES.ORDERS, "delete");
    if (!permissionCheck.success) {
      return NextResponse.json(
        { error: permissionCheck.error },
        {
          status:
            permissionCheck.error === "Authentication required" ? 401 : 403,
        },
      );
    }

    await prisma.oMDeliveryLocation.delete({
      where: { id: params.id },
    });

    return NextResponse.json(
      { message: "Delivery Location deleted successfully" },
      { status: 200 },
    );
  } catch (error: unknown) {
    return handleApiError(error);
  }
}

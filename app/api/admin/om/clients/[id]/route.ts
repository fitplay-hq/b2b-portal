import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { checkPermission } from "@/lib/auth-middleware";
import { RESOURCES } from "@/lib/utils";
import prisma from "@/lib/prisma";
import { handleApiError } from "@/lib/api-errors";
import { OMClientUpdateSchema } from "@/lib/validations/om";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const permissionCheck = await checkPermission(RESOURCES.CLIENTS, "update");
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
    const validatedData = OMClientUpdateSchema.parse(body);

    const client = await prisma.oMClient.update({
      where: { id },
      data: validatedData,
    });

    revalidateTag("om-clients", "page" /* @ts-ignore */);
    revalidateTag("om-dashboard-data", "page" /* @ts-ignore */);
    revalidateTag("om-purchase-orders", "page" /* @ts-ignore */);
    revalidateTag("om-dispatches", "page" /* @ts-ignore */);

    return NextResponse.json(
      { message: "Client updated successfully", data: client },
      { status: 200 },
    );
  } catch (error: unknown) {
    return handleApiError(error);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const permissionCheck = await checkPermission(RESOURCES.CLIENTS, "delete");
    if (!permissionCheck.success) {
      return NextResponse.json(
        { error: permissionCheck.error },
        {
          status:
            permissionCheck.error === "Authentication required" ? 401 : 403,
        },
      );
    }

    const poCount = await prisma.oMPurchaseOrder.count({
      where: { clientId: id },
    });

    if (poCount > 0) {
      return NextResponse.json(
        { error: "Cannot delete client with active purchase orders" },
        { status: 400 },
      );
    }

    await prisma.oMClient.delete({
      where: { id },
    });

    revalidateTag("om-clients", "page" /* @ts-ignore */);
    revalidateTag("om-dashboard-data", "page" /* @ts-ignore */);
    revalidateTag("om-purchase-orders", "page" /* @ts-ignore */);
    revalidateTag("om-dispatches", "page" /* @ts-ignore */);

    return NextResponse.json(
      { message: "Client deleted successfully" },
      { status: 200 },
    );
  } catch (error: unknown) {
    return handleApiError(error);
  }
}

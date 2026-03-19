import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { checkPermission } from "@/lib/auth-middleware";
import { RESOURCES } from "@/lib/utils";
import prisma from "@/lib/prisma";
import { handleApiError } from "@/lib/api-errors";
import { OMClientCreateSchema } from "@/lib/validations/om";
import { getOMClients } from "@/lib/om-data";

export async function GET(req: NextRequest) {
  try {
    const permissionCheck = await checkPermission(RESOURCES.CLIENTS, "view");
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
    const search = searchParams.get("search") || "";

    const result = await getOMClients({ page, limit, search });

    return NextResponse.json(result);
  } catch (error: unknown) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const permissionCheck = await checkPermission(RESOURCES.CLIENTS, "create");
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
    const validatedData = OMClientCreateSchema.parse(body);

    const client = await prisma.oMClient.create({
      data: validatedData,
    });

    revalidateTag("om-clients", "max");
    revalidateTag("om-dashboard", "max");
    revalidateTag("om-purchase-orders", "max");
    revalidateTag("om-dispatch-orders", "max");

    revalidatePath("/admin/order-management/clients");

    return NextResponse.json(
      { message: "Client created successfully", id: client.id, data: client },
      { status: 201 },
    );
  } catch (error: unknown) {
    return handleApiError(error);
  }
}

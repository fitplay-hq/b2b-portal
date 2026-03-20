import { NextRequest, NextResponse } from "next/server";
import { checkPermission } from "@/lib/auth-middleware";
import { RESOURCES } from "@/lib/utils";
import prisma from "@/lib/prisma";
import { handleApiError } from "@/lib/api-errors";
import { OMProductCreateSchema } from "@/lib/validations/om";
import { getOMProducts } from "@/lib/om-data";

export async function GET(req: NextRequest) {
  try {
    const permissionCheck = await checkPermission(RESOURCES.PRODUCTS, "view");
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
    
    // Support both 'q' (standard browser URL) and 'search' (legacy/API standard)
    const search = searchParams.get("q") || searchParams.get("search") || "";
    
    // Support plural 'brandIds' (comma-separated string) and singular 'brandId'
    const brandIdsRaw = searchParams.get("brandIds") || searchParams.get("brandId");
    const brandIds = brandIdsRaw ? brandIdsRaw.split(",") : undefined;

    const minPrice = searchParams.get("minPrice") ? parseFloat(searchParams.get("minPrice")!) : undefined;
    const maxPrice = searchParams.get("maxPrice") ? parseFloat(searchParams.get("maxPrice")!) : undefined;
    const gst = searchParams.get("gst") || undefined;
    const minTotalOrdered = searchParams.get("minTotalOrdered") ? parseInt(searchParams.get("minTotalOrdered")!) : undefined;
    const maxTotalOrdered = searchParams.get("maxTotalOrdered") ? parseInt(searchParams.get("maxTotalOrdered")!) : undefined;

    const result = await getOMProducts({ 
      page, 
      limit, 
      search, 
      brandIds,
      minPrice,
      maxPrice,
      gst,
      minTotalOrdered,
      maxTotalOrdered
    });

    return NextResponse.json(result);
  } catch (error: unknown) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const permissionCheck = await checkPermission(RESOURCES.PRODUCTS, "create");
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
    const validatedData = OMProductCreateSchema.parse(body);
    const { brandIds, code, category, ...prismaData } = validatedData;
    void code;
    void category;

    const product = await prisma.oMProduct.create({
      data: {
        ...prismaData,
        sku: prismaData.sku ? prismaData.sku.trim() : null,
        description: prismaData.description ? prismaData.description.trim() : null,
        price: prismaData.price ?? null,
        ...(brandIds && brandIds.length > 0
          ? {
              brands: {
                connect: brandIds.map((id: string) => ({ id })),
              },
            }
          : {}),
      },
      include: {
        brands: true,
      },
    });

    return NextResponse.json(
      {
        message: "Product created successfully",
        id: product.id,
        data: product,
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    return handleApiError(error);
  }
}

import { NextResponse } from "next/server";
import { checkPermission } from "@/lib/auth-middleware";
import { RESOURCES } from "@/lib/utils";
import { handleApiError } from "@/lib/api-errors";
import { getOMTableCounts } from "@/lib/om-data";

export async function GET(request: Request) {
  try {
    const permissionCheck = await checkPermission(RESOURCES.COMPANIES, "view");
    if (!permissionCheck.success) {
      return NextResponse.json(
        { error: permissionCheck.error },
        {
          status:
            permissionCheck.error === "Authentication required" ? 401 : 403,
        },
      );
    }

    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key") || undefined;

    const result = await getOMTableCounts(key);

    return NextResponse.json(result);
  } catch (error: unknown) {
    return handleApiError(error);
  }
}

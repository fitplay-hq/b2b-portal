import { NextResponse } from "next/server";
import { checkPermission } from "@/lib/auth-middleware";
import { RESOURCES } from "@/lib/utils";
import { handleApiError } from "@/lib/api-errors";
import { getOMTableCounts } from "@/lib/om-data";

export async function GET() {
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

    const result = await getOMTableCounts();

    return NextResponse.json(result);
  } catch (error: unknown) {
    return handleApiError(error);
  }
}

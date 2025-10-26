import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { checkPermission } from "@/lib/auth-middleware";
import { RESOURCES } from "@/lib/utils";

interface InventoryLogEntry {
  id: string;
  date: string;
  productName: string;
  sku: string;
  change: string;
  reason: string;
  remarks: string;
  user: string;
  role: string;
  productId: string;
}

// GET /api/admin/inventory/logs
export async function GET(req: NextRequest) {
  try {
    // Check permissions
    const permissionCheck = await checkPermission(RESOURCES.PRODUCTS, 'view');
    if (!permissionCheck.success) {
      return NextResponse.json(
        { error: permissionCheck.error },
        { status: permissionCheck.error === 'Authentication required' ? 401 : 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    
    // Query parameters
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const sortBy = searchParams.get("sortBy") || "date";
    const sortOrder = searchParams.get("sortOrder") || "desc";
    const search = searchParams.get("search") || "";
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");
    const productName = searchParams.get("productName");
    const sku = searchParams.get("sku");
    const reason = searchParams.get("reason");

    // Get all products with their inventory logs
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        sku: true,
        inventoryLogs: true,
      },
    });

    // Parse and flatten all inventory logs
    const allLogs: InventoryLogEntry[] = [];
    
    products.forEach((product) => {
      if (product.inventoryLogs && product.inventoryLogs.length > 0) {
        product.inventoryLogs.forEach((logString, index) => {
          try {
            // Parse log string: "2024-10-26T10:30:00.000Z | Added 10 units | Reason: NEW_PURCHASE"
            const parts = logString.split(" | ");
            if (parts.length >= 3) {
              const date = parts[0];
              const changeInfo = parts[1]; // "Added 10 units" or "Removed 5 units"
              const reasonInfo = parts[2]; // "Reason: NEW_PURCHASE"
              
              // Extract change amount and direction
              const changeMatch = changeInfo.match(/(Added|Removed)\s+(\d+)\s+units/);
              const change = changeMatch ? 
                `${changeMatch[1] === 'Added' ? '+' : '-'}${changeMatch[2]}` : 
                changeInfo;
              
              // Extract reason
              const reasonMatch = reasonInfo.match(/Reason:\s*(.+)/);
              const extractedReason = reasonMatch ? reasonMatch[1] : reasonInfo;
              
              allLogs.push({
                id: `${product.id}-${index}`,
                date: date,
                productName: product.name,
                sku: product.sku,
                change: change,
                reason: extractedReason,
                remarks: "", // Can be extended later
                user: "Admin", // For now, defaulting to Admin as logs don't store user info yet
                role: "ADMIN",
                productId: product.id,
              });
            }
          } catch (error) {
            console.error("Error parsing log entry:", logString, error);
          }
        });
      }
    });

    // Apply filters
    let filteredLogs = allLogs;

    // Search filter (searches in product name, SKU, reason)
    if (search) {
      const searchLower = search.toLowerCase();
      filteredLogs = filteredLogs.filter(log => 
        log.productName.toLowerCase().includes(searchLower) ||
        log.sku.toLowerCase().includes(searchLower) ||
        log.reason.toLowerCase().includes(searchLower)
      );
    }

    // Date range filter
    if (dateFrom) {
      const fromDate = new Date(dateFrom);
      filteredLogs = filteredLogs.filter(log => new Date(log.date) >= fromDate);
    }
    if (dateTo) {
      const toDate = new Date(dateTo);
      toDate.setHours(23, 59, 59, 999); // End of day
      filteredLogs = filteredLogs.filter(log => new Date(log.date) <= toDate);
    }

    // Product name filter
    if (productName) {
      filteredLogs = filteredLogs.filter(log => 
        log.productName.toLowerCase().includes(productName.toLowerCase())
      );
    }

    // SKU filter
    if (sku) {
      filteredLogs = filteredLogs.filter(log => 
        log.sku.toLowerCase().includes(sku.toLowerCase())
      );
    }

    // Reason filter
    if (reason) {
      filteredLogs = filteredLogs.filter(log => 
        log.reason.toLowerCase().includes(reason.toLowerCase())
      );
    }

    // Apply sorting
    const allowedSortFields = ["date", "productName", "sku", "change", "reason", "user"];
    const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : "date";
    const safeSortOrder = sortOrder === "asc" ? "asc" : "desc";

    filteredLogs.sort((a, b) => {
      let aValue: string | number = a[safeSortBy as keyof InventoryLogEntry];
      let bValue: string | number = b[safeSortBy as keyof InventoryLogEntry];

      // Special handling for date sorting
      if (safeSortBy === "date") {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      // Special handling for change sorting (numeric)
      if (safeSortBy === "change") {
        const aNum = parseInt(String(aValue).replace(/[+\-]/g, '')) || 0;
        const bNum = parseInt(String(bValue).replace(/[+\-]/g, '')) || 0;
        aValue = aNum;
        bValue = bNum;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return safeSortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return safeSortOrder === "asc" ? 1 : -1;
      return 0;
    });

    // Apply pagination
    const offset = (page - 1) * limit;
    const paginatedLogs = filteredLogs.slice(offset, offset + limit);

    const totalLogs = filteredLogs.length;
    const totalPages = Math.ceil(totalLogs / limit);

    return NextResponse.json({
      logs: paginatedLogs,
      pagination: {
        page,
        limit,
        totalLogs,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
      filters: {
        search,
        dateFrom,
        dateTo,
        productName,
        sku,
        reason,
      },
      sorting: {
        sortBy: safeSortBy,
        sortOrder: safeSortOrder,
      },
    });

  } catch (error: unknown) {
    console.error("Error fetching inventory logs:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Something went wrong while fetching inventory logs",
      },
      { status: 500 }
    );
  }
}
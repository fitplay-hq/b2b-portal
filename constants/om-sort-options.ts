import { SortOption } from "@/components/orderManagement/OMSortControl";

/**
 * Purchase Order specific sort options
 */
export const PO_SORT_OPTIONS: SortOption[] = [
  "po_date_desc",
  "po_date_asc",
  "newest",
  "oldest",
  "latest_update",
];

/**
 * Dispatch specific sort options
 */
export const DISPATCH_SORT_OPTIONS: SortOption[] = [
  "dispatch_date_desc",
  "dispatch_date_asc",
  "newest",
  "oldest",
  "latest_update",
];

/**
 * Client specific sort options
 */
export const CLIENT_SORT_OPTIONS: SortOption[] = [
  "name_asc",
  "name_desc",
  "newest",
  "oldest",
  "latest_update",
];

/**
 * Item / Product specific sort options
 */
export const ITEM_SORT_OPTIONS: SortOption[] = [
  "name_asc",
  "name_desc",
  "sku_asc",
  "sku_desc",
  "brand_asc",
  "brand_desc",
  "rate_asc",
  "rate_desc",
  "gst_asc",
  "gst_desc",
  "newest",
  "oldest",
  "latest_update",
];

/**
 * Delivery Location specific sort options
 */
export const LOCATION_SORT_OPTIONS: SortOption[] = [
  "name_asc",
  "name_desc",
  "newest",
  "oldest",
  "latest_update",
];

/**
 * Logistics Partner specific sort options
 */
export const LOGISTICS_SORT_OPTIONS: SortOption[] = [
  "name_asc",
  "name_desc",
  "newest",
  "oldest",
  "latest_update",
];

import { SortOption } from "@/components/orderManagement/OMSortControl";

/**
 * Shared base sort options present in almost all master pages
 */
export const BASE_SORT_OPTIONS: SortOption[] = [
  "name_asc",
  "name_desc",
  "newest",
  "oldest",
  "latest_update",
];

/**
 * Purchase Order specific sort options
 */
export const PO_SORT_OPTIONS: SortOption[] = [
  "po_date_desc",
  "po_date_asc",
];

/**
 * Dispatch specific sort options
 */
export const DISPATCH_SORT_OPTIONS: SortOption[] = [
  "dispatch_date_desc",
  "dispatch_date_asc",
];

/**
 * Client specific sort options
 */
export const CLIENT_SORT_OPTIONS: SortOption[] = [
  "name_asc",
  "name_desc",
  "newest",
  "oldest",
];

/**
 * Item / Product specific sort options
 */
export const ITEM_SORT_OPTIONS: SortOption[] = [
  "name_asc",
  "name_desc",
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

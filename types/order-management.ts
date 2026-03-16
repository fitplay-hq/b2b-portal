/**
 * Order Management (OM) TypeScript interfaces
 * Aligned with Prisma schema and API responses
 */

export type OMPoStatus =
  | "DRAFT"
  | "CONFIRMED"
  | "PARTIALLY_DISPATCHED"
  | "FULLY_DISPATCHED"
  | "CLOSED";

export type OMDispatchStatus =
  | "PENDING"
  | "APPROVED"
  | "READY_FOR_DISPATCH"
  | "DISPATCHED"
  | "AT_DESTINATION"
  | "DELIVERED"
  | "CANCELLED";

export const OM_DISPATCH_STATUS_CONFIG: Record<
  OMDispatchStatus,
  { label: string; color: string }
> = {
  PENDING: {
    label: "Pending",
    color: "bg-gray-100 text-gray-800 hover:bg-gray-100 border-transparent",
  },
  APPROVED: {
    label: "Approved",
    color: "bg-blue-100 text-blue-800 hover:bg-blue-100 border-transparent",
  },
  CANCELLED: {
    label: "Cancelled",
    color: "bg-red-100 text-red-800 hover:bg-red-100 border-transparent",
  },
  READY_FOR_DISPATCH: {
    label: "Ready For Dispatch",
    color: "bg-orange-100 text-orange-800 hover:bg-orange-100 border-transparent",
  },
  DISPATCHED: {
    label: "Dispatched",
    color: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-transparent",
  },
  AT_DESTINATION: {
    label: "At Destination",
    color: "bg-teal-100 text-teal-800 hover:bg-teal-100 border-transparent",
  },
  DELIVERED: {
    label: "Delivered",
    color: "bg-green-100 text-green-800 hover:bg-green-100 border-transparent",
  },
};

export const getDispatchStatusVisuals = (status: string) => {
  return (
    OM_DISPATCH_STATUS_CONFIG[status as OMDispatchStatus] ||
    OM_DISPATCH_STATUS_CONFIG.PENDING
  );
};

export interface OMClient {
  id: string;
  name: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  billingAddress?: string;
  gstNumber?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface OMBrand {
  id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface OMProduct {
  id: string;
  name: string;
  sku?: string | null;
  description?: string | null;
  price?: number | null;
  defaultGstPct: number;
  category?: string | null;
  brandId?: string | null;
  OMBrand?: OMBrand | null;
  brands?: OMBrand[];
  totalOrdered?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface OMLogisticsPartner {
  id: string;
  name: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  defaultMode?: "Air" | "Surface" | "Road";
  createdAt?: string;
  updatedAt?: string;
}

export interface OMDeliveryLocation {
  id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface OMPurchaseOrderItem {
  id: string;
  productId: string;
  quantity: number;
  rate: number;
  amount: number;
  gstPercentage: number;
  gstAmount: number;
  totalAmount: number;
  brandId?: string | null;
  description?: string | null;
  product?: {
    name?: string;
    sku?: string | null;
    brandId?: string | null;
    OMBrand?: OMBrand | null;
    brands?: OMBrand[];
  };
  OMBrand?: OMBrand | null;
  dispatchItems?: { quantity: number }[];
}

export interface OMDispatchOrderItem {
  id: string;
  purchaseOrderItemId: string;
  quantity: number;
  rate: number;
  amount: number;
  gstPercentage: number;
  gstAmount: number;
  totalAmount: number;
  purchaseOrderItem?: {
    product?: { name?: string; sku?: string | null; brands?: OMBrand[] };
    OMBrand?: OMBrand | null;
  };
  product?: { name?: string; sku?: string | null };
  brandName?: string | null;
}

export interface OMDispatchOrder {
  id: string;
  purchaseOrderId: string;
  invoiceNumber: string;
  invoiceDate: string;
  logisticsPartnerId: string;
  docketNumber: string;
  expectedDeliveryDate: string;
  dispatchDate?: string;
  deliveryDate?: string;
  status: OMDispatchStatus;
  items?: OMDispatchOrderItem[];
  shipmentBoxes?: OMShipmentBox[];
  purchaseOrder?: {
    id: string;
    clientId: string;
    poNumber: string;
    poDate?: string;
    estimateNumber?: string;
    deliveryLocations?: { name?: string }[];
    client?: { name?: string };
  };
  deliveryLocationId?: string;
  deliveryLocation?: { name?: string };
  logisticsPartner?: { name?: string };
  createdAt?: string;
}

export interface OMPurchaseOrder {
  id: string;
  clientId: string;
  estimateNumber: string;
  estimateDate: string;
  poNumber: string;
  poDate: string;
  poReceivedDate: string;
  status: OMPoStatus;
  totalGst: number;
  grandTotal: number;
  subtotal?: number;
  totalQuantity?: number;
  items?: OMPurchaseOrderItem[];
  dispatchOrders?: OMDispatchOrder[];
  client?: OMClient;
  deliveryLocations?: OMDeliveryLocation[];
  createdAt?: string;
  updatedAt?: string;
}

// Dashboard / search API transformed types
export interface OMDashboardLineItem {
  id: string;
  itemId: string;
  itemName: string;
  itemSku?: string | null;
  quantity: number;
  rate: number;
  amount: number;
  gstPercentage: number;
  gstAmount: number;
  totalAmount: number;
  brandName?: string | null;
}

export interface OMDashboardPO {
  id: string;
  clientId: string;
  clientName: string;
  deliveryLocations: string[];
  estimateNumber: string;
  estimateDate: string;
  poNumber: string;
  poDate: string;
  poReceivedDate: string;
  totalQuantity: number;
  subtotal: number;
  totalGst: number;
  grandTotal: number;
  status: OMPoStatus;
  lineItems: OMDashboardLineItem[];
}

export interface OMBoxContent {
  itemId: string;
  itemName: string;
  quantity: number;
}

export interface OMShipmentBox {
  boxId: string;
  boxNumber: string | number;
  length: number; // in cm
  width: number; // in cm
  height: number; // in cm
  weight: number; // in kg
  numberOfBoxes: number; // count of identical boxes
  contents: OMBoxContent[];
}

/**
 * Computed helpers for Shipment Packing
 */
export const OMShipmentHelpers = {
  /**
   * Calculate volume of a single box in cubic meters (m3)
   */
  calculateBoxVolume: (box: Pick<OMShipmentBox, "length" | "width" | "height">) => {
    return (box.length * box.width * box.height) / 1000000;
  },

  /**
   * Calculate total volume of a group of identical boxes
   */
  calculateTotalBoxVolume: (box: Pick<OMShipmentBox, "length" | "width" | "height" | "numberOfBoxes">) => {
    return OMShipmentHelpers.calculateBoxVolume(box) * box.numberOfBoxes;
  },

  /**
   * Calculate total boxes in a shipment
   */
  getTotalBoxes: (shipmentBoxes: OMShipmentBox[]) => {
    return shipmentBoxes.reduce((sum, box) => sum + box.numberOfBoxes, 0);
  },

  /**
   * Calculate total volume of all boxes in a shipment
   */
  getTotalVolume: (shipmentBoxes: OMShipmentBox[]) => {
    return shipmentBoxes.reduce(
      (sum, box) => sum + OMShipmentHelpers.calculateTotalBoxVolume(box),
      0
    );
  },

  /**
   * Calculate total items packed across all boxes
   */
  getTotalItemsPacked: (shipmentBoxes: OMShipmentBox[]) => {
    return shipmentBoxes.reduce((sum, box) => {
      const itemsInOneBox = box.contents.reduce((iSum, item) => iSum + item.quantity, 0);
      return sum + itemsInOneBox * box.numberOfBoxes;
    }, 0);
  },

  /**
   * Calculate total weight of a group of identical boxes
   */
  calculateTotalBoxWeight: (box: Pick<OMShipmentBox, "weight" | "numberOfBoxes">) => {
    return (box.weight || 0) * box.numberOfBoxes;
  },

  /**
   * Calculate total weight of all boxes in a shipment
   */
  getTotalWeight: (shipmentBoxes: OMShipmentBox[]) => {
    return shipmentBoxes.reduce(
      (sum, box) => sum + OMShipmentHelpers.calculateTotalBoxWeight(box),
      0
    );
  },
};

export interface OMDashboardDispatchLineItem {
  poLineItemId: string;
  dispatchQty: number;
  itemName: string;
  itemSku?: string | null;
  brandName?: string | null;
}

export interface OMDashboardDispatch {
  id: string;
  poId: string;
  poNumber: string;
  clientId: string;
  clientName: string;
  invoiceNumber: string;
  invoiceDate?: string;
  dispatchDate?: string;
  totalDispatchQty: number;
  logisticsPartnerName: string;
  docketNumber: string;
  status: OMDispatchStatus;
  lineItems: OMDashboardDispatchLineItem[];
}

export interface OMClientSummary {
  clientName: string;
  totalOrders: number;
  ordered: number;
  dispatched: number;
  remaining: number;
  value: number;
}

export interface OMItemSummary {
  itemName: string;
  itemSku?: string | null;
  brandName?: string | null;
  ordered: number;
  dispatched: number;
  remaining: number;
}

export interface OMPaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

import { z } from "zod";

// --- OMClient Validation ---
export const OMClientCreateSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters"),
});

export const OMClientUpdateSchema = OMClientCreateSchema.partial();

// --- OMBrand Validation ---
export const OMBrandCreateSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters"),
});

// --- OMProduct Validation ---
export const OMProductCreateSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters"),
  sku: z
    .string()
    .max(100, "SKU must be less than 100 characters")
    .optional()
    .nullable(),
  description: z
    .string()
    .max(255, "Description must be less than 255 characters")
    .optional()
    .nullable(),
  price: z
    .number()
    .min(0, "Price must be a positive number")
    .optional()
    .nullable(),
  defaultGstPct: z
    .number()
    .min(0, "GST percentage must be positive")
    .default(0)
    .optional(),
  category: z.string().max(100).optional().nullable(),
  brandIds: z.array(z.string()).optional(),
  code: z.string().max(50).optional().nullable(),
});

export const OMProductUpdateSchema = OMProductCreateSchema.partial();

// --- OMLogisticsPartner Validation ---
export const OMLogisticsPartnerCreateSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters"),
});

export const OMLogisticsPartnerUpdateSchema =
  OMLogisticsPartnerCreateSchema.partial();

// --- OMDeliveryLocation Validation ---
export const OMDeliveryLocationCreateSchema = z.object({
  name: z
    .string()
    .min(1, "City Name is required")
    .max(100, "City Name must be less than 100 characters")
    .regex(
      /^[a-zA-Z0-9\s.,-]+$/,
      "City Name can only contain letters, numbers, spaces, dots, and hyphens",
    ),
});

export const OMDeliveryLocationUpdateSchema =
  OMDeliveryLocationCreateSchema.partial();

// --- OMPurchaseOrderItem Validation ---
export const OMPurchaseOrderItemCreateSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
  rate: z.number().min(0, "Rate must be a non-negative number"),
  gstPercentage: z.number().min(0, "GST percentage must be non-negative"),
  brandId: z.string().optional().nullable(),
  description: z.string().max(255).optional().nullable(),
});

// --- OMPurchaseOrder Validation ---
export const OMPurchaseOrderCreateSchema = z.object({
  clientId: z.string().min(1, "Client ID is required"),
  locationId: z.string().optional().nullable(),
  estimateNumber: z.string().optional().nullable(),
  estimateDate: z
    .string()
    .datetime({ message: "Invalid Estimate Date format" })
    .optional()
    .nullable(),
  poNumber: z.string().optional().nullable(),
  poDate: z
    .string()
    .datetime({ message: "Invalid PO Date format" })
    .optional()
    .nullable(),
  poReceivedDate: z
    .string()
    .datetime({ message: "Invalid PO Received Date format" })
    .optional()
    .nullable(),
  status: z
    .enum([
      "DRAFT",
      "CONFIRMED",
      "PARTIALLY_DISPATCHED",
      "FULLY_DISPATCHED",
      "CLOSED",
    ])
    .optional()
    .default("CONFIRMED"),
  items: z
    .array(OMPurchaseOrderItemCreateSchema)
    .min(1, "At least one item is required for the PO"),
});

export const OMPurchaseOrderUpdateSchema =
  OMPurchaseOrderCreateSchema.partial();

// --- OMDispatchOrderItem Validation ---
export const OMDispatchOrderItemCreateSchema = z.object({
  purchaseOrderItemId: z.string().min(1, "Purchase Order Item ID is required"),
  quantity: z.number().int().min(1, "Dispatch quantity must be at least 1"),
  rate: z.number().min(0, "Rate must be a non-negative number"),
  gstPercentage: z.number().min(0, "GST percentage must be non-negative"),
  amount: z.number().min(0),
  gstAmount: z.number().min(0),
  totalAmount: z.number().min(0),
});

// --- OMDispatchOrder Validation ---
export const OMDispatchOrderCreateSchema = z.object({
  purchaseOrderId: z.string().min(1, "Purchase Order ID is required"),
  invoiceNumber: z.string().optional().nullable(),
  invoiceDate: z
    .string()
    .datetime({ message: "Invalid Invoice Date format" })
    .optional()
    .nullable(),
  logisticsPartnerId: z.string().optional().nullable(),
  docketNumber: z.string().optional().nullable(),
  expectedDeliveryDate: z
    .string()
    .datetime({ message: "Invalid Expected Delivery Date format" })
    .optional()
    .nullable(),
  status: z
    .enum([
      "PENDING",
      "APPROVED",
      "READY_FOR_DISPATCH",
      "DISPATCHED",
      "AT_DESTINATION",
      "DELIVERED",
      "CANCELLED",
    ])
    .optional()
    .default("PENDING"),
  items: z
    .array(OMDispatchOrderItemCreateSchema)
    .min(1, "At least one dispatch item is required"),
  shipmentBoxes: z
    .array(
      z.object({
        boxNumber: z.union([z.string(), z.number()]).optional(),
        length: z.number().positive("Length must be a positive number"),
        width: z.number().positive("Width must be a positive number"),
        height: z.number().positive("Height must be a positive number"),
        weight: z.number().min(0, "Weight must be non-negative").optional().default(0),
        numberOfBoxes: z
          .number()
          .int()
          .min(1, "Number of boxes must be at least 1"),
        contents: z.array(
          z.object({
            itemId: z.string().min(1, "Item ID is required"),
            quantity: z.number().int().min(1, "Quantity must be at least 1"),
          }),
        ),
      }),
    )
    .optional(),
});

export const OMDispatchOrderUpdateSchema = OMDispatchOrderCreateSchema.partial().extend({
  purchaseOrderId: z.string().optional(),
});

// --- OMShipmentBox Validation ---
export const OMShipmentBoxCreateSchema = z.object({
  boxNumber: z.union([z.string(), z.number()]).optional(),
  length: z.number().positive("Length must be a positive number"),
  width: z.number().positive("Width must be a positive number"),
  height: z.number().positive("Height must be a positive number"),
  weight: z.number().min(0, "Weight must be non-negative").optional().default(0),
  numberOfBoxes: z.number().int().min(1, "Number of boxes must be at least 1"),
});

export const OMShipmentBoxUpdateSchema = OMShipmentBoxCreateSchema.partial();

// --- OMShipmentBoxContent Validation ---
export const OMShipmentBoxContentCreateSchema = z.object({
  dispatchOrderItemId: z.string().uuid("Invalid Dispatch Order Item ID"),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
});

export const OMShipmentBoxContentUpdateSchema = z.object({
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
});

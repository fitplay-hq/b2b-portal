import { z } from "zod";

// --- OMClient Validation ---
export const OMClientCreateSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters"),
});

export const OMClientUpdateSchema = OMClientCreateSchema.partial();

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
    .default(18)
    .optional(),
  category: z.string().max(100).optional().nullable(),
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
      /^[a-zA-Z\s]+$/,
      "Only City Name is allowed, no special characters or numbers",
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
});

// --- OMPurchaseOrder Validation ---
export const OMPurchaseOrderCreateSchema = z.object({
  clientId: z.string().min(1, "Client ID is required"),
  locationId: z.string().min(1, "Delivery Location ID is required"),
  estimateNumber: z.string().min(1, "Estimate Number is required"),
  estimateDate: z
    .string()
    .datetime({ message: "Invalid Estimate Date format" }),
  poNumber: z.string().min(1, "PO Number is required"),
  poDate: z.string().datetime({ message: "Invalid PO Date format" }),
  poReceivedDate: z
    .string()
    .datetime({ message: "Invalid PO Received Date format" }),
  status: z.enum(["DRAFT", "CONFIRMED"]).optional().default("CONFIRMED"),
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
});

// --- OMDispatchOrder Validation ---
export const OMDispatchOrderCreateSchema = z.object({
  purchaseOrderId: z.string().min(1, "Purchase Order ID is required"),
  invoiceNumber: z.string().min(1, "Invoice Number is required"),
  invoiceDate: z.string().datetime({ message: "Invalid Invoice Date format" }),
  logisticsPartnerId: z.string().min(1, "Logistics Partner ID is required"),
  docketNumber: z.string().min(1, "Docket Number is required"),
  expectedDeliveryDate: z
    .string()
    .datetime({ message: "Invalid Expected Delivery Date format" }),
  status: z
    .enum(["CREATED", "DISPATCHED", "DELIVERED", "CANCELLED"])
    .optional()
    .default("CREATED"),
  items: z
    .array(OMDispatchOrderItemCreateSchema)
    .min(1, "At least one dispatch item is required"),
});

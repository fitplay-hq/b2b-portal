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

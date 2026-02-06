import * as z from 'zod';
import { ReasonSchema } from '../../enums/Reason.schema';
import { CategorySchema } from '../../enums/Category.schema';
// prettier-ignore
export const ProductInputSchema = z.object({
    id: z.string(),
    name: z.string(),
    images: z.array(z.string()),
    price: z.number().int().optional().nullable(),
    sku: z.string(),
    availableStock: z.number().int(),
    minStockThreshold: z.number().int().optional().nullable(),
    inventoryUpdateReason: ReasonSchema.optional().nullable(),
    inventoryLogs: z.array(z.string()),
    description: z.string(),
    categories: CategorySchema.optional().nullable(),
    categoryId: z.string().optional().nullable(),
    category: z.unknown().optional().nullable(),
    subCategory: z.unknown().optional().nullable(),
    subCategoryId: z.string().optional().nullable(),
    avgRating: z.number().optional().nullable(),
    noOfReviews: z.number().int().optional().nullable(),
    brand: z.string().optional().nullable(),
    companies: z.array(z.unknown()),
    clients: z.array(z.unknown()),
    orderItems: z.array(z.unknown()),
    bundleOrderItems: z.array(z.unknown()),
    createdAt: z.date(),
    updatedAt: z.date(),
    bundleItems: z.array(z.unknown())
}).strict();

export type ProductInputType = z.infer<typeof ProductInputSchema>;

import * as z from 'zod';
import { ReasonSchema } from '../../enums/Reason.schema';
import { CategorySchema } from '../../enums/Category.schema';
// prettier-ignore
export const ProductModelSchema = z.object({
    id: z.string(),
    name: z.string(),
    images: z.array(z.string()),
    price: z.number().int().nullable(),
    sku: z.string(),
    availableStock: z.number().int(),
    minStockThreshold: z.number().int().nullable(),
    inventoryUpdateReason: ReasonSchema.nullable(),
    inventoryLogs: z.array(z.string()),
    description: z.string(),
    categories: CategorySchema.nullable(),
    categoryId: z.string().nullable(),
    category: z.unknown().nullable(),
    subCategory: z.unknown().nullable(),
    subCategoryId: z.string().nullable(),
    avgRating: z.number().nullable(),
    noOfReviews: z.number().int().nullable(),
    brand: z.string().nullable(),
    companies: z.array(z.unknown()),
    clients: z.array(z.unknown()),
    orderItems: z.array(z.unknown()),
    bundleOrderItems: z.array(z.unknown()),
    createdAt: z.date(),
    updatedAt: z.date(),
    bundleItems: z.array(z.unknown())
}).strict();

export type ProductPureType = z.infer<typeof ProductModelSchema>;

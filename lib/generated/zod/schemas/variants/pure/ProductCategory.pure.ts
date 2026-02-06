import * as z from 'zod';
// prettier-ignore
export const ProductCategoryModelSchema = z.object({
    id: z.string(),
    name: z.string(),
    displayName: z.string(),
    description: z.string().nullable(),
    shortCode: z.string(),
    isActive: z.boolean(),
    sortOrder: z.number().int(),
    createdAt: z.date(),
    updatedAt: z.date(),
    products: z.array(z.unknown()),
    subCategories: z.array(z.unknown())
}).strict();

export type ProductCategoryPureType = z.infer<typeof ProductCategoryModelSchema>;

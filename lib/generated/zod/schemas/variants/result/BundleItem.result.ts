import * as z from 'zod';
// prettier-ignore
export const BundleItemResultSchema = z.object({
    id: z.string(),
    bundleId: z.string(),
    bundle: z.unknown(),
    product: z.unknown(),
    productId: z.string(),
    bundleProductQuantity: z.number().int(),
    price: z.number(),
    createdAt: z.date(),
    updatedAt: z.date(),
    bundleOrderItems: z.array(z.unknown())
}).strict();

export type BundleItemResultType = z.infer<typeof BundleItemResultSchema>;

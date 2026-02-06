import * as z from 'zod';
// prettier-ignore
export const BundleOrderItemModelSchema = z.object({
    id: z.string(),
    bundleId: z.string(),
    bundle: z.unknown(),
    order: z.unknown(),
    orderId: z.string(),
    product: z.unknown(),
    productId: z.string(),
    quantity: z.number().int(),
    price: z.number(),
    bundleItems: z.array(z.unknown())
}).strict();

export type BundleOrderItemPureType = z.infer<typeof BundleOrderItemModelSchema>;

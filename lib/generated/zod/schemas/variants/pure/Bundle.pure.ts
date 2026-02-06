import * as z from 'zod';
// prettier-ignore
export const BundleModelSchema = z.object({
    id: z.string(),
    orderId: z.string().nullable(),
    order: z.unknown().nullable(),
    price: z.number().nullable(),
    numberOfBundles: z.number().int().nullable(),
    items: z.array(z.unknown()),
    bundleOrderItems: z.array(z.unknown()),
    createdAt: z.date(),
    updatedAt: z.date()
}).strict();

export type BundlePureType = z.infer<typeof BundleModelSchema>;

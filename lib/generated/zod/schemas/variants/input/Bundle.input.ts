import * as z from 'zod';
// prettier-ignore
export const BundleInputSchema = z.object({
    id: z.string(),
    orderId: z.string().optional().nullable(),
    order: z.unknown().optional().nullable(),
    price: z.number().optional().nullable(),
    numberOfBundles: z.number().int().optional().nullable(),
    items: z.array(z.unknown()),
    bundleOrderItems: z.array(z.unknown()),
    createdAt: z.date(),
    updatedAt: z.date()
}).strict();

export type BundleInputType = z.infer<typeof BundleInputSchema>;

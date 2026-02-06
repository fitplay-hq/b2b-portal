import * as z from 'zod';
// prettier-ignore
export const ClientProductModelSchema = z.object({
    id: z.string(),
    client: z.unknown(),
    clientId: z.string(),
    product: z.unknown(),
    productId: z.string(),
    createdAt: z.date(),
    updatedAt: z.date()
}).strict();

export type ClientProductPureType = z.infer<typeof ClientProductModelSchema>;

import * as z from 'zod';
// prettier-ignore
export const ClientProductInputSchema = z.object({
    id: z.string(),
    client: z.unknown(),
    clientId: z.string(),
    product: z.unknown(),
    productId: z.string(),
    createdAt: z.date(),
    updatedAt: z.date()
}).strict();

export type ClientProductInputType = z.infer<typeof ClientProductInputSchema>;

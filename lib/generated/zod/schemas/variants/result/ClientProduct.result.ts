import * as z from 'zod';
// prettier-ignore
export const ClientProductResultSchema = z.object({
    id: z.string(),
    client: z.unknown(),
    clientId: z.string(),
    product: z.unknown(),
    productId: z.string(),
    createdAt: z.date(),
    updatedAt: z.date()
}).strict();

export type ClientProductResultType = z.infer<typeof ClientProductResultSchema>;

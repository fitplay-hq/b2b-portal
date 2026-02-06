import * as z from 'zod';
// prettier-ignore
export const OrderItemInputSchema = z.object({
    id: z.string(),
    order: z.unknown(),
    orderId: z.string(),
    product: z.unknown(),
    productId: z.string(),
    quantity: z.number().int(),
    price: z.number()
}).strict();

export type OrderItemInputType = z.infer<typeof OrderItemInputSchema>;

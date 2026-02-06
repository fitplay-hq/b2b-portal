import * as z from 'zod';
import { StatusSchema } from '../../enums/Status.schema';
// prettier-ignore
export const OrderEmailInputSchema = z.object({
    id: z.string(),
    order: z.unknown(),
    orderId: z.string(),
    purpose: StatusSchema,
    isSent: z.boolean(),
    sentAt: z.date().optional().nullable(),
    createdAt: z.date(),
    updatedAt: z.date()
}).strict();

export type OrderEmailInputType = z.infer<typeof OrderEmailInputSchema>;

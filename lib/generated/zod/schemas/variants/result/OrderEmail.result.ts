import * as z from 'zod';
import { StatusSchema } from '../../enums/Status.schema';
// prettier-ignore
export const OrderEmailResultSchema = z.object({
    id: z.string(),
    order: z.unknown(),
    orderId: z.string(),
    purpose: StatusSchema,
    isSent: z.boolean(),
    sentAt: z.date().nullable(),
    createdAt: z.date(),
    updatedAt: z.date()
}).strict();

export type OrderEmailResultType = z.infer<typeof OrderEmailResultSchema>;

import * as z from 'zod';
import { StatusSchema } from '../../enums/Status.schema';
// prettier-ignore
export const OrderEmailModelSchema = z.object({
    id: z.string(),
    order: z.unknown(),
    orderId: z.string(),
    purpose: StatusSchema,
    isSent: z.boolean(),
    sentAt: z.date().nullable(),
    createdAt: z.date(),
    updatedAt: z.date()
}).strict();

export type OrderEmailPureType = z.infer<typeof OrderEmailModelSchema>;

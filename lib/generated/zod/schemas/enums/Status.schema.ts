import * as z from 'zod';

export const StatusSchema = z.enum(['PENDING', 'APPROVED', 'CANCELLED', 'READY_FOR_DISPATCH', 'DISPATCHED', 'AT_DESTINATION', 'DELIVERED'])

export type Status = z.infer<typeof StatusSchema>;
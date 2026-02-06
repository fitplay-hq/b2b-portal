import * as z from 'zod';

export const ReasonSchema = z.enum(['NEW_PURCHASE', 'PHYSICAL_STOCK_CHECK', 'RETURN_FROM_PREVIOUS_DISPATCH', 'NEW_ORDER'])

export type Reason = z.infer<typeof ReasonSchema>;
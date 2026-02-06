import * as z from 'zod';

export const OrderEmailScalarFieldEnumSchema = z.enum(['id', 'orderId', 'purpose', 'isSent', 'sentAt', 'createdAt', 'updatedAt'])

export type OrderEmailScalarFieldEnum = z.infer<typeof OrderEmailScalarFieldEnumSchema>;
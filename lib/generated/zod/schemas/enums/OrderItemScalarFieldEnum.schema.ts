import * as z from 'zod';

export const OrderItemScalarFieldEnumSchema = z.enum(['id', 'orderId', 'productId', 'quantity', 'price'])

export type OrderItemScalarFieldEnum = z.infer<typeof OrderItemScalarFieldEnumSchema>;
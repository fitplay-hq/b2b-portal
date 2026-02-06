import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { OrderArgsObjectSchema as OrderArgsObjectSchema } from './OrderArgs.schema';
import { ProductArgsObjectSchema as ProductArgsObjectSchema } from './ProductArgs.schema'

const makeSchema = () => z.object({
  id: z.boolean().optional(),
  order: z.union([z.boolean(), z.lazy(() => OrderArgsObjectSchema)]).optional(),
  orderId: z.boolean().optional(),
  product: z.union([z.boolean(), z.lazy(() => ProductArgsObjectSchema)]).optional(),
  productId: z.boolean().optional(),
  quantity: z.boolean().optional(),
  price: z.boolean().optional()
}).strict();
export const OrderItemSelectObjectSchema: z.ZodType<Prisma.OrderItemSelect> = makeSchema() as unknown as z.ZodType<Prisma.OrderItemSelect>;
export const OrderItemSelectObjectZodSchema = makeSchema();

import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { OrderArgsObjectSchema as OrderArgsObjectSchema } from './OrderArgs.schema';
import { ProductArgsObjectSchema as ProductArgsObjectSchema } from './ProductArgs.schema'

const makeSchema = () => z.object({
  order: z.union([z.boolean(), z.lazy(() => OrderArgsObjectSchema)]).optional(),
  product: z.union([z.boolean(), z.lazy(() => ProductArgsObjectSchema)]).optional()
}).strict();
export const OrderItemIncludeObjectSchema: z.ZodType<Prisma.OrderItemInclude> = makeSchema() as unknown as z.ZodType<Prisma.OrderItemInclude>;
export const OrderItemIncludeObjectZodSchema = makeSchema();

import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { OrderItemWhereInputObjectSchema as OrderItemWhereInputObjectSchema } from './OrderItemWhereInput.schema'

const makeSchema = () => z.object({
  every: z.lazy(() => OrderItemWhereInputObjectSchema).optional(),
  some: z.lazy(() => OrderItemWhereInputObjectSchema).optional(),
  none: z.lazy(() => OrderItemWhereInputObjectSchema).optional()
}).strict();
export const OrderItemListRelationFilterObjectSchema: z.ZodType<Prisma.OrderItemListRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.OrderItemListRelationFilter>;
export const OrderItemListRelationFilterObjectZodSchema = makeSchema();

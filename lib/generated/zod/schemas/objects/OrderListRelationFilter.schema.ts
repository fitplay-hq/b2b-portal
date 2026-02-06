import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { OrderWhereInputObjectSchema as OrderWhereInputObjectSchema } from './OrderWhereInput.schema'

const makeSchema = () => z.object({
  every: z.lazy(() => OrderWhereInputObjectSchema).optional(),
  some: z.lazy(() => OrderWhereInputObjectSchema).optional(),
  none: z.lazy(() => OrderWhereInputObjectSchema).optional()
}).strict();
export const OrderListRelationFilterObjectSchema: z.ZodType<Prisma.OrderListRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.OrderListRelationFilter>;
export const OrderListRelationFilterObjectZodSchema = makeSchema();

import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { OrderEmailWhereInputObjectSchema as OrderEmailWhereInputObjectSchema } from './OrderEmailWhereInput.schema'

const makeSchema = () => z.object({
  every: z.lazy(() => OrderEmailWhereInputObjectSchema).optional(),
  some: z.lazy(() => OrderEmailWhereInputObjectSchema).optional(),
  none: z.lazy(() => OrderEmailWhereInputObjectSchema).optional()
}).strict();
export const OrderEmailListRelationFilterObjectSchema: z.ZodType<Prisma.OrderEmailListRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.OrderEmailListRelationFilter>;
export const OrderEmailListRelationFilterObjectZodSchema = makeSchema();

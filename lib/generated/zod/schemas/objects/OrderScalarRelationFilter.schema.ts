import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { OrderWhereInputObjectSchema as OrderWhereInputObjectSchema } from './OrderWhereInput.schema'

const makeSchema = () => z.object({
  is: z.lazy(() => OrderWhereInputObjectSchema).optional(),
  isNot: z.lazy(() => OrderWhereInputObjectSchema).optional()
}).strict();
export const OrderScalarRelationFilterObjectSchema: z.ZodType<Prisma.OrderScalarRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.OrderScalarRelationFilter>;
export const OrderScalarRelationFilterObjectZodSchema = makeSchema();

import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { OrderWhereInputObjectSchema as OrderWhereInputObjectSchema } from './OrderWhereInput.schema'

const makeSchema = () => z.object({
  is: z.lazy(() => OrderWhereInputObjectSchema).optional().nullable(),
  isNot: z.lazy(() => OrderWhereInputObjectSchema).optional().nullable()
}).strict();
export const OrderNullableScalarRelationFilterObjectSchema: z.ZodType<Prisma.OrderNullableScalarRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.OrderNullableScalarRelationFilter>;
export const OrderNullableScalarRelationFilterObjectZodSchema = makeSchema();

import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  address: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
export const CompanyCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.CompanyCountOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.CompanyCountOrderByAggregateInput>;
export const CompanyCountOrderByAggregateInputObjectZodSchema = makeSchema();

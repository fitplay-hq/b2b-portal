import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  email: SortOrderSchema.optional(),
  password: SortOrderSchema.optional(),
  role: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
export const AdminMinOrderByAggregateInputObjectSchema: z.ZodType<Prisma.AdminMinOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.AdminMinOrderByAggregateInput>;
export const AdminMinOrderByAggregateInputObjectZodSchema = makeSchema();

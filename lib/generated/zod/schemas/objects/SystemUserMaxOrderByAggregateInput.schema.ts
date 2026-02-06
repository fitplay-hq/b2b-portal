import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  email: SortOrderSchema.optional(),
  password: SortOrderSchema.optional(),
  isActive: SortOrderSchema.optional(),
  roleId: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
export const SystemUserMaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.SystemUserMaxOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.SystemUserMaxOrderByAggregateInput>;
export const SystemUserMaxOrderByAggregateInputObjectZodSchema = makeSchema();

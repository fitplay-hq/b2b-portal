import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  description: SortOrderSchema.optional(),
  isActive: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
export const SystemRoleCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.SystemRoleCountOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.SystemRoleCountOrderByAggregateInput>;
export const SystemRoleCountOrderByAggregateInputObjectZodSchema = makeSchema();

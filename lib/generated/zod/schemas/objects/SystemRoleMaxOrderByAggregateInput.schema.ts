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
export const SystemRoleMaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.SystemRoleMaxOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.SystemRoleMaxOrderByAggregateInput>;
export const SystemRoleMaxOrderByAggregateInputObjectZodSchema = makeSchema();

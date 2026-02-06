import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  resource: SortOrderSchema.optional(),
  action: SortOrderSchema.optional(),
  description: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
export const SystemPermissionMinOrderByAggregateInputObjectSchema: z.ZodType<Prisma.SystemPermissionMinOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.SystemPermissionMinOrderByAggregateInput>;
export const SystemPermissionMinOrderByAggregateInputObjectZodSchema = makeSchema();

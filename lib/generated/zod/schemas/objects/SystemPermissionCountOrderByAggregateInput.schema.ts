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
export const SystemPermissionCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.SystemPermissionCountOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.SystemPermissionCountOrderByAggregateInput>;
export const SystemPermissionCountOrderByAggregateInputObjectZodSchema = makeSchema();

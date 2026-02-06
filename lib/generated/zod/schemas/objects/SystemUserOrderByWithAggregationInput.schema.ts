import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SystemUserCountOrderByAggregateInputObjectSchema as SystemUserCountOrderByAggregateInputObjectSchema } from './SystemUserCountOrderByAggregateInput.schema';
import { SystemUserMaxOrderByAggregateInputObjectSchema as SystemUserMaxOrderByAggregateInputObjectSchema } from './SystemUserMaxOrderByAggregateInput.schema';
import { SystemUserMinOrderByAggregateInputObjectSchema as SystemUserMinOrderByAggregateInputObjectSchema } from './SystemUserMinOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  email: SortOrderSchema.optional(),
  password: SortOrderSchema.optional(),
  isActive: SortOrderSchema.optional(),
  roleId: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  _count: z.lazy(() => SystemUserCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => SystemUserMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => SystemUserMinOrderByAggregateInputObjectSchema).optional()
}).strict();
export const SystemUserOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.SystemUserOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.SystemUserOrderByWithAggregationInput>;
export const SystemUserOrderByWithAggregationInputObjectZodSchema = makeSchema();

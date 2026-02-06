import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { SystemRoleCountOrderByAggregateInputObjectSchema as SystemRoleCountOrderByAggregateInputObjectSchema } from './SystemRoleCountOrderByAggregateInput.schema';
import { SystemRoleMaxOrderByAggregateInputObjectSchema as SystemRoleMaxOrderByAggregateInputObjectSchema } from './SystemRoleMaxOrderByAggregateInput.schema';
import { SystemRoleMinOrderByAggregateInputObjectSchema as SystemRoleMinOrderByAggregateInputObjectSchema } from './SystemRoleMinOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  description: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  isActive: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  _count: z.lazy(() => SystemRoleCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => SystemRoleMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => SystemRoleMinOrderByAggregateInputObjectSchema).optional()
}).strict();
export const SystemRoleOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.SystemRoleOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.SystemRoleOrderByWithAggregationInput>;
export const SystemRoleOrderByWithAggregationInputObjectZodSchema = makeSchema();

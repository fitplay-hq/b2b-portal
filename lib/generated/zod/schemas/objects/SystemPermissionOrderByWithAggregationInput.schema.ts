import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { SystemPermissionCountOrderByAggregateInputObjectSchema as SystemPermissionCountOrderByAggregateInputObjectSchema } from './SystemPermissionCountOrderByAggregateInput.schema';
import { SystemPermissionMaxOrderByAggregateInputObjectSchema as SystemPermissionMaxOrderByAggregateInputObjectSchema } from './SystemPermissionMaxOrderByAggregateInput.schema';
import { SystemPermissionMinOrderByAggregateInputObjectSchema as SystemPermissionMinOrderByAggregateInputObjectSchema } from './SystemPermissionMinOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  resource: SortOrderSchema.optional(),
  action: SortOrderSchema.optional(),
  description: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  _count: z.lazy(() => SystemPermissionCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => SystemPermissionMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => SystemPermissionMinOrderByAggregateInputObjectSchema).optional()
}).strict();
export const SystemPermissionOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.SystemPermissionOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.SystemPermissionOrderByWithAggregationInput>;
export const SystemPermissionOrderByWithAggregationInputObjectZodSchema = makeSchema();

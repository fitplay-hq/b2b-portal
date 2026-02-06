import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { SystemPermissionOrderByRelationAggregateInputObjectSchema as SystemPermissionOrderByRelationAggregateInputObjectSchema } from './SystemPermissionOrderByRelationAggregateInput.schema';
import { SystemUserOrderByRelationAggregateInputObjectSchema as SystemUserOrderByRelationAggregateInputObjectSchema } from './SystemUserOrderByRelationAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  description: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  isActive: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  permissions: z.lazy(() => SystemPermissionOrderByRelationAggregateInputObjectSchema).optional(),
  users: z.lazy(() => SystemUserOrderByRelationAggregateInputObjectSchema).optional()
}).strict();
export const SystemRoleOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.SystemRoleOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.SystemRoleOrderByWithRelationInput>;
export const SystemRoleOrderByWithRelationInputObjectZodSchema = makeSchema();

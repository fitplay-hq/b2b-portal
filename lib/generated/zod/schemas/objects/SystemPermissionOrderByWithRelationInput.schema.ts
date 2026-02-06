import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { SystemRoleOrderByRelationAggregateInputObjectSchema as SystemRoleOrderByRelationAggregateInputObjectSchema } from './SystemRoleOrderByRelationAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  resource: SortOrderSchema.optional(),
  action: SortOrderSchema.optional(),
  description: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  roles: z.lazy(() => SystemRoleOrderByRelationAggregateInputObjectSchema).optional()
}).strict();
export const SystemPermissionOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.SystemPermissionOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.SystemPermissionOrderByWithRelationInput>;
export const SystemPermissionOrderByWithRelationInputObjectZodSchema = makeSchema();

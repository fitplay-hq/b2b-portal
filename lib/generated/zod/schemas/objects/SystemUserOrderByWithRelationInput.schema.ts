import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SystemRoleOrderByWithRelationInputObjectSchema as SystemRoleOrderByWithRelationInputObjectSchema } from './SystemRoleOrderByWithRelationInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  email: SortOrderSchema.optional(),
  password: SortOrderSchema.optional(),
  isActive: SortOrderSchema.optional(),
  roleId: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  role: z.lazy(() => SystemRoleOrderByWithRelationInputObjectSchema).optional()
}).strict();
export const SystemUserOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.SystemUserOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.SystemUserOrderByWithRelationInput>;
export const SystemUserOrderByWithRelationInputObjectZodSchema = makeSchema();

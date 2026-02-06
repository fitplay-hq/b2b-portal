import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SystemPermissionCreateNestedManyWithoutRolesInputObjectSchema as SystemPermissionCreateNestedManyWithoutRolesInputObjectSchema } from './SystemPermissionCreateNestedManyWithoutRolesInput.schema';
import { SystemUserCreateNestedManyWithoutRoleInputObjectSchema as SystemUserCreateNestedManyWithoutRoleInputObjectSchema } from './SystemUserCreateNestedManyWithoutRoleInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string().max(50),
  description: z.string().max(255).optional().nullable(),
  isActive: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  permissions: z.lazy(() => SystemPermissionCreateNestedManyWithoutRolesInputObjectSchema).optional(),
  users: z.lazy(() => SystemUserCreateNestedManyWithoutRoleInputObjectSchema).optional()
}).strict();
export const SystemRoleCreateInputObjectSchema: z.ZodType<Prisma.SystemRoleCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.SystemRoleCreateInput>;
export const SystemRoleCreateInputObjectZodSchema = makeSchema();

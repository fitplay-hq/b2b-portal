import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SystemPermissionCreateNestedManyWithoutRolesInputObjectSchema as SystemPermissionCreateNestedManyWithoutRolesInputObjectSchema } from './SystemPermissionCreateNestedManyWithoutRolesInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string().max(50),
  description: z.string().max(255).optional().nullable(),
  isActive: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  permissions: z.lazy(() => SystemPermissionCreateNestedManyWithoutRolesInputObjectSchema).optional()
}).strict();
export const SystemRoleCreateWithoutUsersInputObjectSchema: z.ZodType<Prisma.SystemRoleCreateWithoutUsersInput> = makeSchema() as unknown as z.ZodType<Prisma.SystemRoleCreateWithoutUsersInput>;
export const SystemRoleCreateWithoutUsersInputObjectZodSchema = makeSchema();

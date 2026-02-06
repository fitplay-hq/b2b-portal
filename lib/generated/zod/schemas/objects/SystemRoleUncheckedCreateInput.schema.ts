import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SystemPermissionUncheckedCreateNestedManyWithoutRolesInputObjectSchema as SystemPermissionUncheckedCreateNestedManyWithoutRolesInputObjectSchema } from './SystemPermissionUncheckedCreateNestedManyWithoutRolesInput.schema';
import { SystemUserUncheckedCreateNestedManyWithoutRoleInputObjectSchema as SystemUserUncheckedCreateNestedManyWithoutRoleInputObjectSchema } from './SystemUserUncheckedCreateNestedManyWithoutRoleInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string().max(50),
  description: z.string().max(255).optional().nullable(),
  isActive: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  permissions: z.lazy(() => SystemPermissionUncheckedCreateNestedManyWithoutRolesInputObjectSchema).optional(),
  users: z.lazy(() => SystemUserUncheckedCreateNestedManyWithoutRoleInputObjectSchema).optional()
}).strict();
export const SystemRoleUncheckedCreateInputObjectSchema: z.ZodType<Prisma.SystemRoleUncheckedCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.SystemRoleUncheckedCreateInput>;
export const SystemRoleUncheckedCreateInputObjectZodSchema = makeSchema();

import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SystemPermissionUncheckedCreateNestedManyWithoutRolesInputObjectSchema as SystemPermissionUncheckedCreateNestedManyWithoutRolesInputObjectSchema } from './SystemPermissionUncheckedCreateNestedManyWithoutRolesInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  permissions: z.lazy(() => SystemPermissionUncheckedCreateNestedManyWithoutRolesInputObjectSchema).optional()
}).strict();
export const SystemRoleUncheckedCreateWithoutUsersInputObjectSchema: z.ZodType<Prisma.SystemRoleUncheckedCreateWithoutUsersInput> = makeSchema() as unknown as z.ZodType<Prisma.SystemRoleUncheckedCreateWithoutUsersInput>;
export const SystemRoleUncheckedCreateWithoutUsersInputObjectZodSchema = makeSchema();

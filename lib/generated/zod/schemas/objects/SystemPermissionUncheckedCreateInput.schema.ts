import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SystemRoleUncheckedCreateNestedManyWithoutPermissionsInputObjectSchema as SystemRoleUncheckedCreateNestedManyWithoutPermissionsInputObjectSchema } from './SystemRoleUncheckedCreateNestedManyWithoutPermissionsInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  resource: z.string().max(50),
  action: z.string().max(20),
  description: z.string().max(255).optional().nullable(),
  createdAt: z.coerce.date().optional(),
  roles: z.lazy(() => SystemRoleUncheckedCreateNestedManyWithoutPermissionsInputObjectSchema).optional()
}).strict();
export const SystemPermissionUncheckedCreateInputObjectSchema: z.ZodType<Prisma.SystemPermissionUncheckedCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.SystemPermissionUncheckedCreateInput>;
export const SystemPermissionUncheckedCreateInputObjectZodSchema = makeSchema();

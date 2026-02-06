import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SystemUserUncheckedCreateNestedManyWithoutRoleInputObjectSchema as SystemUserUncheckedCreateNestedManyWithoutRoleInputObjectSchema } from './SystemUserUncheckedCreateNestedManyWithoutRoleInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string(),
  description: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  users: z.lazy(() => SystemUserUncheckedCreateNestedManyWithoutRoleInputObjectSchema).optional()
}).strict();
export const SystemRoleUncheckedCreateWithoutPermissionsInputObjectSchema: z.ZodType<Prisma.SystemRoleUncheckedCreateWithoutPermissionsInput> = makeSchema() as unknown as z.ZodType<Prisma.SystemRoleUncheckedCreateWithoutPermissionsInput>;
export const SystemRoleUncheckedCreateWithoutPermissionsInputObjectZodSchema = makeSchema();

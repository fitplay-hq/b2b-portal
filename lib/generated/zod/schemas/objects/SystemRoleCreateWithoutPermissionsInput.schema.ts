import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SystemUserCreateNestedManyWithoutRoleInputObjectSchema as SystemUserCreateNestedManyWithoutRoleInputObjectSchema } from './SystemUserCreateNestedManyWithoutRoleInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string().max(50),
  description: z.string().max(255).optional().nullable(),
  isActive: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  users: z.lazy(() => SystemUserCreateNestedManyWithoutRoleInputObjectSchema).optional()
}).strict();
export const SystemRoleCreateWithoutPermissionsInputObjectSchema: z.ZodType<Prisma.SystemRoleCreateWithoutPermissionsInput> = makeSchema() as unknown as z.ZodType<Prisma.SystemRoleCreateWithoutPermissionsInput>;
export const SystemRoleCreateWithoutPermissionsInputObjectZodSchema = makeSchema();

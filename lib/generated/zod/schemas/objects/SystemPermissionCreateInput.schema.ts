import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SystemRoleCreateNestedManyWithoutPermissionsInputObjectSchema as SystemRoleCreateNestedManyWithoutPermissionsInputObjectSchema } from './SystemRoleCreateNestedManyWithoutPermissionsInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  resource: z.string().max(50),
  action: z.string().max(20),
  description: z.string().max(255).optional().nullable(),
  createdAt: z.coerce.date().optional(),
  roles: z.lazy(() => SystemRoleCreateNestedManyWithoutPermissionsInputObjectSchema).optional()
}).strict();
export const SystemPermissionCreateInputObjectSchema: z.ZodType<Prisma.SystemPermissionCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.SystemPermissionCreateInput>;
export const SystemPermissionCreateInputObjectZodSchema = makeSchema();

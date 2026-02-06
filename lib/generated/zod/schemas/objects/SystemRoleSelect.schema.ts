import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SystemPermissionFindManySchema as SystemPermissionFindManySchema } from '../findManySystemPermission.schema';
import { SystemUserFindManySchema as SystemUserFindManySchema } from '../findManySystemUser.schema';
import { SystemRoleCountOutputTypeArgsObjectSchema as SystemRoleCountOutputTypeArgsObjectSchema } from './SystemRoleCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  description: z.boolean().optional(),
  isActive: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  permissions: z.union([z.boolean(), z.lazy(() => SystemPermissionFindManySchema)]).optional(),
  users: z.union([z.boolean(), z.lazy(() => SystemUserFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => SystemRoleCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const SystemRoleSelectObjectSchema: z.ZodType<Prisma.SystemRoleSelect> = makeSchema() as unknown as z.ZodType<Prisma.SystemRoleSelect>;
export const SystemRoleSelectObjectZodSchema = makeSchema();

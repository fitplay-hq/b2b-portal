import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SystemPermissionFindManySchema as SystemPermissionFindManySchema } from '../findManySystemPermission.schema';
import { SystemUserFindManySchema as SystemUserFindManySchema } from '../findManySystemUser.schema';
import { SystemRoleCountOutputTypeArgsObjectSchema as SystemRoleCountOutputTypeArgsObjectSchema } from './SystemRoleCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  permissions: z.union([z.boolean(), z.lazy(() => SystemPermissionFindManySchema)]).optional(),
  users: z.union([z.boolean(), z.lazy(() => SystemUserFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => SystemRoleCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const SystemRoleIncludeObjectSchema: z.ZodType<Prisma.SystemRoleInclude> = makeSchema() as unknown as z.ZodType<Prisma.SystemRoleInclude>;
export const SystemRoleIncludeObjectZodSchema = makeSchema();

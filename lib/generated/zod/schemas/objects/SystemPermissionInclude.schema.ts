import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SystemRoleFindManySchema as SystemRoleFindManySchema } from '../findManySystemRole.schema';
import { SystemPermissionCountOutputTypeArgsObjectSchema as SystemPermissionCountOutputTypeArgsObjectSchema } from './SystemPermissionCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  roles: z.union([z.boolean(), z.lazy(() => SystemRoleFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => SystemPermissionCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const SystemPermissionIncludeObjectSchema: z.ZodType<Prisma.SystemPermissionInclude> = makeSchema() as unknown as z.ZodType<Prisma.SystemPermissionInclude>;
export const SystemPermissionIncludeObjectZodSchema = makeSchema();

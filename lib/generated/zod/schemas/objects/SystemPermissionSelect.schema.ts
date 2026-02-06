import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SystemRoleFindManySchema as SystemRoleFindManySchema } from '../findManySystemRole.schema';
import { SystemPermissionCountOutputTypeArgsObjectSchema as SystemPermissionCountOutputTypeArgsObjectSchema } from './SystemPermissionCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  id: z.boolean().optional(),
  resource: z.boolean().optional(),
  action: z.boolean().optional(),
  description: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  roles: z.union([z.boolean(), z.lazy(() => SystemRoleFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => SystemPermissionCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const SystemPermissionSelectObjectSchema: z.ZodType<Prisma.SystemPermissionSelect> = makeSchema() as unknown as z.ZodType<Prisma.SystemPermissionSelect>;
export const SystemPermissionSelectObjectZodSchema = makeSchema();

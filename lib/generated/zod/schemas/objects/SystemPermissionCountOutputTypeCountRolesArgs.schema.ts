import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SystemRoleWhereInputObjectSchema as SystemRoleWhereInputObjectSchema } from './SystemRoleWhereInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => SystemRoleWhereInputObjectSchema).optional()
}).strict();
export const SystemPermissionCountOutputTypeCountRolesArgsObjectSchema = makeSchema();
export const SystemPermissionCountOutputTypeCountRolesArgsObjectZodSchema = makeSchema();

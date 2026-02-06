import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SystemPermissionWhereInputObjectSchema as SystemPermissionWhereInputObjectSchema } from './SystemPermissionWhereInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => SystemPermissionWhereInputObjectSchema).optional()
}).strict();
export const SystemRoleCountOutputTypeCountPermissionsArgsObjectSchema = makeSchema();
export const SystemRoleCountOutputTypeCountPermissionsArgsObjectZodSchema = makeSchema();

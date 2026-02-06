import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SystemPermissionCountOutputTypeCountRolesArgsObjectSchema as SystemPermissionCountOutputTypeCountRolesArgsObjectSchema } from './SystemPermissionCountOutputTypeCountRolesArgs.schema'

const makeSchema = () => z.object({
  roles: z.union([z.boolean(), z.lazy(() => SystemPermissionCountOutputTypeCountRolesArgsObjectSchema)]).optional()
}).strict();
export const SystemPermissionCountOutputTypeSelectObjectSchema: z.ZodType<Prisma.SystemPermissionCountOutputTypeSelect> = makeSchema() as unknown as z.ZodType<Prisma.SystemPermissionCountOutputTypeSelect>;
export const SystemPermissionCountOutputTypeSelectObjectZodSchema = makeSchema();

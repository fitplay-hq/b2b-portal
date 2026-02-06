import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SystemRoleCountOutputTypeCountPermissionsArgsObjectSchema as SystemRoleCountOutputTypeCountPermissionsArgsObjectSchema } from './SystemRoleCountOutputTypeCountPermissionsArgs.schema';
import { SystemRoleCountOutputTypeCountUsersArgsObjectSchema as SystemRoleCountOutputTypeCountUsersArgsObjectSchema } from './SystemRoleCountOutputTypeCountUsersArgs.schema'

const makeSchema = () => z.object({
  permissions: z.union([z.boolean(), z.lazy(() => SystemRoleCountOutputTypeCountPermissionsArgsObjectSchema)]).optional(),
  users: z.union([z.boolean(), z.lazy(() => SystemRoleCountOutputTypeCountUsersArgsObjectSchema)]).optional()
}).strict();
export const SystemRoleCountOutputTypeSelectObjectSchema: z.ZodType<Prisma.SystemRoleCountOutputTypeSelect> = makeSchema() as unknown as z.ZodType<Prisma.SystemRoleCountOutputTypeSelect>;
export const SystemRoleCountOutputTypeSelectObjectZodSchema = makeSchema();

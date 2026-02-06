import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SystemUserWhereInputObjectSchema as SystemUserWhereInputObjectSchema } from './SystemUserWhereInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => SystemUserWhereInputObjectSchema).optional()
}).strict();
export const SystemRoleCountOutputTypeCountUsersArgsObjectSchema = makeSchema();
export const SystemRoleCountOutputTypeCountUsersArgsObjectZodSchema = makeSchema();

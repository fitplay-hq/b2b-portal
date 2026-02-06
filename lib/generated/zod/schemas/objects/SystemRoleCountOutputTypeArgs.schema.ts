import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SystemRoleCountOutputTypeSelectObjectSchema as SystemRoleCountOutputTypeSelectObjectSchema } from './SystemRoleCountOutputTypeSelect.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => SystemRoleCountOutputTypeSelectObjectSchema).optional()
}).strict();
export const SystemRoleCountOutputTypeArgsObjectSchema = makeSchema();
export const SystemRoleCountOutputTypeArgsObjectZodSchema = makeSchema();

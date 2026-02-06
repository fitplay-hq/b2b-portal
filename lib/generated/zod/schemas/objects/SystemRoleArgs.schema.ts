import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SystemRoleSelectObjectSchema as SystemRoleSelectObjectSchema } from './SystemRoleSelect.schema';
import { SystemRoleIncludeObjectSchema as SystemRoleIncludeObjectSchema } from './SystemRoleInclude.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => SystemRoleSelectObjectSchema).optional(),
  include: z.lazy(() => SystemRoleIncludeObjectSchema).optional()
}).strict();
export const SystemRoleArgsObjectSchema = makeSchema();
export const SystemRoleArgsObjectZodSchema = makeSchema();

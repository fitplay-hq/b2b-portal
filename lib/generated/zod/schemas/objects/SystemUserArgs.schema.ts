import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SystemUserSelectObjectSchema as SystemUserSelectObjectSchema } from './SystemUserSelect.schema';
import { SystemUserIncludeObjectSchema as SystemUserIncludeObjectSchema } from './SystemUserInclude.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => SystemUserSelectObjectSchema).optional(),
  include: z.lazy(() => SystemUserIncludeObjectSchema).optional()
}).strict();
export const SystemUserArgsObjectSchema = makeSchema();
export const SystemUserArgsObjectZodSchema = makeSchema();

import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SystemPermissionCountOutputTypeSelectObjectSchema as SystemPermissionCountOutputTypeSelectObjectSchema } from './SystemPermissionCountOutputTypeSelect.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => SystemPermissionCountOutputTypeSelectObjectSchema).optional()
}).strict();
export const SystemPermissionCountOutputTypeArgsObjectSchema = makeSchema();
export const SystemPermissionCountOutputTypeArgsObjectZodSchema = makeSchema();

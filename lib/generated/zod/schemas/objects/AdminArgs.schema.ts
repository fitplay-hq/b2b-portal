import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { AdminSelectObjectSchema as AdminSelectObjectSchema } from './AdminSelect.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => AdminSelectObjectSchema).optional()
}).strict();
export const AdminArgsObjectSchema = makeSchema();
export const AdminArgsObjectZodSchema = makeSchema();

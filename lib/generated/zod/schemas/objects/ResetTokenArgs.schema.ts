import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ResetTokenSelectObjectSchema as ResetTokenSelectObjectSchema } from './ResetTokenSelect.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => ResetTokenSelectObjectSchema).optional()
}).strict();
export const ResetTokenArgsObjectSchema = makeSchema();
export const ResetTokenArgsObjectZodSchema = makeSchema();

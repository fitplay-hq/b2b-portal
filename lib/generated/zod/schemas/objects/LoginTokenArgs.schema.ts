import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { LoginTokenSelectObjectSchema as LoginTokenSelectObjectSchema } from './LoginTokenSelect.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => LoginTokenSelectObjectSchema).optional()
}).strict();
export const LoginTokenArgsObjectSchema = makeSchema();
export const LoginTokenArgsObjectZodSchema = makeSchema();

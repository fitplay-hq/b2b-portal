import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SystemRoleArgsObjectSchema as SystemRoleArgsObjectSchema } from './SystemRoleArgs.schema'

const makeSchema = () => z.object({
  role: z.union([z.boolean(), z.lazy(() => SystemRoleArgsObjectSchema)]).optional()
}).strict();
export const SystemUserIncludeObjectSchema: z.ZodType<Prisma.SystemUserInclude> = makeSchema() as unknown as z.ZodType<Prisma.SystemUserInclude>;
export const SystemUserIncludeObjectZodSchema = makeSchema();

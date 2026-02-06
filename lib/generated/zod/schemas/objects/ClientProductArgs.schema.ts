import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ClientProductSelectObjectSchema as ClientProductSelectObjectSchema } from './ClientProductSelect.schema';
import { ClientProductIncludeObjectSchema as ClientProductIncludeObjectSchema } from './ClientProductInclude.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => ClientProductSelectObjectSchema).optional(),
  include: z.lazy(() => ClientProductIncludeObjectSchema).optional()
}).strict();
export const ClientProductArgsObjectSchema = makeSchema();
export const ClientProductArgsObjectZodSchema = makeSchema();

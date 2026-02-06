import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { OrderSelectObjectSchema as OrderSelectObjectSchema } from './OrderSelect.schema';
import { OrderIncludeObjectSchema as OrderIncludeObjectSchema } from './OrderInclude.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => OrderSelectObjectSchema).optional(),
  include: z.lazy(() => OrderIncludeObjectSchema).optional()
}).strict();
export const OrderArgsObjectSchema = makeSchema();
export const OrderArgsObjectZodSchema = makeSchema();

import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { OrderEmailSelectObjectSchema as OrderEmailSelectObjectSchema } from './OrderEmailSelect.schema';
import { OrderEmailIncludeObjectSchema as OrderEmailIncludeObjectSchema } from './OrderEmailInclude.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => OrderEmailSelectObjectSchema).optional(),
  include: z.lazy(() => OrderEmailIncludeObjectSchema).optional()
}).strict();
export const OrderEmailArgsObjectSchema = makeSchema();
export const OrderEmailArgsObjectZodSchema = makeSchema();

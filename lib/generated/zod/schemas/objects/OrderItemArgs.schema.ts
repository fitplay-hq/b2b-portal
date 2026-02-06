import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { OrderItemSelectObjectSchema as OrderItemSelectObjectSchema } from './OrderItemSelect.schema';
import { OrderItemIncludeObjectSchema as OrderItemIncludeObjectSchema } from './OrderItemInclude.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => OrderItemSelectObjectSchema).optional(),
  include: z.lazy(() => OrderItemIncludeObjectSchema).optional()
}).strict();
export const OrderItemArgsObjectSchema = makeSchema();
export const OrderItemArgsObjectZodSchema = makeSchema();

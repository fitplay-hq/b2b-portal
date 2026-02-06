import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { OrderArgsObjectSchema as OrderArgsObjectSchema } from './OrderArgs.schema'

const makeSchema = () => z.object({
  order: z.union([z.boolean(), z.lazy(() => OrderArgsObjectSchema)]).optional()
}).strict();
export const OrderEmailIncludeObjectSchema: z.ZodType<Prisma.OrderEmailInclude> = makeSchema() as unknown as z.ZodType<Prisma.OrderEmailInclude>;
export const OrderEmailIncludeObjectZodSchema = makeSchema();

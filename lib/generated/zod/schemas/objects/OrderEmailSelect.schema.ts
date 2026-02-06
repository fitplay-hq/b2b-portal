import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { OrderArgsObjectSchema as OrderArgsObjectSchema } from './OrderArgs.schema'

const makeSchema = () => z.object({
  id: z.boolean().optional(),
  order: z.union([z.boolean(), z.lazy(() => OrderArgsObjectSchema)]).optional(),
  orderId: z.boolean().optional(),
  purpose: z.boolean().optional(),
  isSent: z.boolean().optional(),
  sentAt: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional()
}).strict();
export const OrderEmailSelectObjectSchema: z.ZodType<Prisma.OrderEmailSelect> = makeSchema() as unknown as z.ZodType<Prisma.OrderEmailSelect>;
export const OrderEmailSelectObjectZodSchema = makeSchema();

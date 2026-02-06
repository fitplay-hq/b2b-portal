import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { StatusSchema } from '../enums/Status.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  orderId: z.string(),
  purpose: StatusSchema,
  isSent: z.boolean().optional(),
  sentAt: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional()
}).strict();
export const OrderEmailUncheckedCreateInputObjectSchema: z.ZodType<Prisma.OrderEmailUncheckedCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderEmailUncheckedCreateInput>;
export const OrderEmailUncheckedCreateInputObjectZodSchema = makeSchema();

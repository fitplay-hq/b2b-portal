import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { StatusSchema } from '../enums/Status.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  orderId: z.string(),
  purpose: StatusSchema,
  isSent: z.boolean().optional(),
  sentAt: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();
export const OrderEmailCreateManyInputObjectSchema: z.ZodType<Prisma.OrderEmailCreateManyInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderEmailCreateManyInput>;
export const OrderEmailCreateManyInputObjectZodSchema = makeSchema();

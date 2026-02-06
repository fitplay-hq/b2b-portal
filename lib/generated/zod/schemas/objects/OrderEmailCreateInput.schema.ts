import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { StatusSchema } from '../enums/Status.schema';
import { OrderCreateNestedOneWithoutEmailsInputObjectSchema as OrderCreateNestedOneWithoutEmailsInputObjectSchema } from './OrderCreateNestedOneWithoutEmailsInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  purpose: StatusSchema,
  isSent: z.boolean().optional(),
  sentAt: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  order: z.lazy(() => OrderCreateNestedOneWithoutEmailsInputObjectSchema)
}).strict();
export const OrderEmailCreateInputObjectSchema: z.ZodType<Prisma.OrderEmailCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderEmailCreateInput>;
export const OrderEmailCreateInputObjectZodSchema = makeSchema();

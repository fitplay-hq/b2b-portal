import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { StringWithAggregatesFilterObjectSchema as StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { EnumStatusWithAggregatesFilterObjectSchema as EnumStatusWithAggregatesFilterObjectSchema } from './EnumStatusWithAggregatesFilter.schema';
import { StatusSchema } from '../enums/Status.schema';
import { BoolWithAggregatesFilterObjectSchema as BoolWithAggregatesFilterObjectSchema } from './BoolWithAggregatesFilter.schema';
import { DateTimeNullableWithAggregatesFilterObjectSchema as DateTimeNullableWithAggregatesFilterObjectSchema } from './DateTimeNullableWithAggregatesFilter.schema';
import { DateTimeWithAggregatesFilterObjectSchema as DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema'

const orderemailscalarwherewithaggregatesinputSchema = z.object({
  AND: z.union([z.lazy(() => OrderEmailScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => OrderEmailScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => OrderEmailScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => OrderEmailScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => OrderEmailScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  orderId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  purpose: z.union([z.lazy(() => EnumStatusWithAggregatesFilterObjectSchema), StatusSchema]).optional(),
  isSent: z.union([z.lazy(() => BoolWithAggregatesFilterObjectSchema), z.boolean()]).optional(),
  sentAt: z.union([z.lazy(() => DateTimeNullableWithAggregatesFilterObjectSchema), z.coerce.date()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const OrderEmailScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.OrderEmailScalarWhereWithAggregatesInput> = orderemailscalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.OrderEmailScalarWhereWithAggregatesInput>;
export const OrderEmailScalarWhereWithAggregatesInputObjectZodSchema = orderemailscalarwherewithaggregatesinputSchema;

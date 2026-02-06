import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { EnumStatusFilterObjectSchema as EnumStatusFilterObjectSchema } from './EnumStatusFilter.schema';
import { StatusSchema } from '../enums/Status.schema';
import { BoolFilterObjectSchema as BoolFilterObjectSchema } from './BoolFilter.schema';
import { DateTimeNullableFilterObjectSchema as DateTimeNullableFilterObjectSchema } from './DateTimeNullableFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema'

const orderemailscalarwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => OrderEmailScalarWhereInputObjectSchema), z.lazy(() => OrderEmailScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => OrderEmailScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => OrderEmailScalarWhereInputObjectSchema), z.lazy(() => OrderEmailScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  orderId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  purpose: z.union([z.lazy(() => EnumStatusFilterObjectSchema), StatusSchema]).optional(),
  isSent: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
  sentAt: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.coerce.date()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const OrderEmailScalarWhereInputObjectSchema: z.ZodType<Prisma.OrderEmailScalarWhereInput> = orderemailscalarwhereinputSchema as unknown as z.ZodType<Prisma.OrderEmailScalarWhereInput>;
export const OrderEmailScalarWhereInputObjectZodSchema = orderemailscalarwhereinputSchema;

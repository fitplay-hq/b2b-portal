import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { StringWithAggregatesFilterObjectSchema as StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { FloatWithAggregatesFilterObjectSchema as FloatWithAggregatesFilterObjectSchema } from './FloatWithAggregatesFilter.schema';
import { StringNullableWithAggregatesFilterObjectSchema as StringNullableWithAggregatesFilterObjectSchema } from './StringNullableWithAggregatesFilter.schema';
import { EnumModesWithAggregatesFilterObjectSchema as EnumModesWithAggregatesFilterObjectSchema } from './EnumModesWithAggregatesFilter.schema';
import { ModesSchema } from '../enums/Modes.schema';
import { DateTimeWithAggregatesFilterObjectSchema as DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema';
import { BoolWithAggregatesFilterObjectSchema as BoolWithAggregatesFilterObjectSchema } from './BoolWithAggregatesFilter.schema';
import { EnumStatusWithAggregatesFilterObjectSchema as EnumStatusWithAggregatesFilterObjectSchema } from './EnumStatusWithAggregatesFilter.schema';
import { StatusSchema } from '../enums/Status.schema';
import { IntNullableWithAggregatesFilterObjectSchema as IntNullableWithAggregatesFilterObjectSchema } from './IntNullableWithAggregatesFilter.schema'

const orderscalarwherewithaggregatesinputSchema = z.object({
  AND: z.union([z.lazy(() => OrderScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => OrderScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => OrderScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => OrderScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => OrderScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  totalAmount: z.union([z.lazy(() => FloatWithAggregatesFilterObjectSchema), z.number()]).optional(),
  consigneeName: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  consigneePhone: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  consigneeEmail: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  consignmentNumber: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  deliveryService: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  deliveryAddress: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  city: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  state: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  pincode: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  modeOfDelivery: z.union([z.lazy(() => EnumModesWithAggregatesFilterObjectSchema), ModesSchema]).optional(),
  requiredByDate: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
  deliveryReference: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  packagingInstructions: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  note: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  shippingLabelUrl: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  isMailSent: z.union([z.lazy(() => BoolWithAggregatesFilterObjectSchema), z.boolean()]).optional(),
  status: z.union([z.lazy(() => EnumStatusWithAggregatesFilterObjectSchema), StatusSchema]).optional(),
  clientId: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
  numberOfBundles: z.union([z.lazy(() => IntNullableWithAggregatesFilterObjectSchema), z.number().int()]).optional().nullable()
}).strict();
export const OrderScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.OrderScalarWhereWithAggregatesInput> = orderscalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.OrderScalarWhereWithAggregatesInput>;
export const OrderScalarWhereWithAggregatesInputObjectZodSchema = orderscalarwherewithaggregatesinputSchema;

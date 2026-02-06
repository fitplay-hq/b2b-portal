import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { FloatFilterObjectSchema as FloatFilterObjectSchema } from './FloatFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { EnumModesFilterObjectSchema as EnumModesFilterObjectSchema } from './EnumModesFilter.schema';
import { ModesSchema } from '../enums/Modes.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { BoolFilterObjectSchema as BoolFilterObjectSchema } from './BoolFilter.schema';
import { EnumStatusFilterObjectSchema as EnumStatusFilterObjectSchema } from './EnumStatusFilter.schema';
import { StatusSchema } from '../enums/Status.schema';
import { IntNullableFilterObjectSchema as IntNullableFilterObjectSchema } from './IntNullableFilter.schema'

const orderscalarwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => OrderScalarWhereInputObjectSchema), z.lazy(() => OrderScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => OrderScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => OrderScalarWhereInputObjectSchema), z.lazy(() => OrderScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  totalAmount: z.union([z.lazy(() => FloatFilterObjectSchema), z.number()]).optional(),
  consigneeName: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  consigneePhone: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  consigneeEmail: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  consignmentNumber: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  deliveryService: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  deliveryAddress: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  city: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  state: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  pincode: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  modeOfDelivery: z.union([z.lazy(() => EnumModesFilterObjectSchema), ModesSchema]).optional(),
  requiredByDate: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  deliveryReference: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  packagingInstructions: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  note: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  shippingLabelUrl: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  isMailSent: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
  status: z.union([z.lazy(() => EnumStatusFilterObjectSchema), StatusSchema]).optional(),
  clientId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  numberOfBundles: z.union([z.lazy(() => IntNullableFilterObjectSchema), z.number().int()]).optional().nullable()
}).strict();
export const OrderScalarWhereInputObjectSchema: z.ZodType<Prisma.OrderScalarWhereInput> = orderscalarwhereinputSchema as unknown as z.ZodType<Prisma.OrderScalarWhereInput>;
export const OrderScalarWhereInputObjectZodSchema = orderscalarwhereinputSchema;

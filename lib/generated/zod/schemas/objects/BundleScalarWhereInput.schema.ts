import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { FloatNullableFilterObjectSchema as FloatNullableFilterObjectSchema } from './FloatNullableFilter.schema';
import { IntNullableFilterObjectSchema as IntNullableFilterObjectSchema } from './IntNullableFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema'

const bundlescalarwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => BundleScalarWhereInputObjectSchema), z.lazy(() => BundleScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => BundleScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => BundleScalarWhereInputObjectSchema), z.lazy(() => BundleScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  orderId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  price: z.union([z.lazy(() => FloatNullableFilterObjectSchema), z.number()]).optional().nullable(),
  numberOfBundles: z.union([z.lazy(() => IntNullableFilterObjectSchema), z.number().int()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const BundleScalarWhereInputObjectSchema: z.ZodType<Prisma.BundleScalarWhereInput> = bundlescalarwhereinputSchema as unknown as z.ZodType<Prisma.BundleScalarWhereInput>;
export const BundleScalarWhereInputObjectZodSchema = bundlescalarwhereinputSchema;

import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { StringWithAggregatesFilterObjectSchema as StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { StringNullableWithAggregatesFilterObjectSchema as StringNullableWithAggregatesFilterObjectSchema } from './StringNullableWithAggregatesFilter.schema';
import { FloatNullableWithAggregatesFilterObjectSchema as FloatNullableWithAggregatesFilterObjectSchema } from './FloatNullableWithAggregatesFilter.schema';
import { IntNullableWithAggregatesFilterObjectSchema as IntNullableWithAggregatesFilterObjectSchema } from './IntNullableWithAggregatesFilter.schema';
import { DateTimeWithAggregatesFilterObjectSchema as DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema'

const bundlescalarwherewithaggregatesinputSchema = z.object({
  AND: z.union([z.lazy(() => BundleScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => BundleScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => BundleScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => BundleScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => BundleScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  orderId: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  price: z.union([z.lazy(() => FloatNullableWithAggregatesFilterObjectSchema), z.number()]).optional().nullable(),
  numberOfBundles: z.union([z.lazy(() => IntNullableWithAggregatesFilterObjectSchema), z.number().int()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const BundleScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.BundleScalarWhereWithAggregatesInput> = bundlescalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.BundleScalarWhereWithAggregatesInput>;
export const BundleScalarWhereWithAggregatesInputObjectZodSchema = bundlescalarwherewithaggregatesinputSchema;

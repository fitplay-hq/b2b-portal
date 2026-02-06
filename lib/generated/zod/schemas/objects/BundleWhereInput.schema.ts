import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { FloatNullableFilterObjectSchema as FloatNullableFilterObjectSchema } from './FloatNullableFilter.schema';
import { IntNullableFilterObjectSchema as IntNullableFilterObjectSchema } from './IntNullableFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { OrderNullableScalarRelationFilterObjectSchema as OrderNullableScalarRelationFilterObjectSchema } from './OrderNullableScalarRelationFilter.schema';
import { OrderWhereInputObjectSchema as OrderWhereInputObjectSchema } from './OrderWhereInput.schema';
import { BundleItemListRelationFilterObjectSchema as BundleItemListRelationFilterObjectSchema } from './BundleItemListRelationFilter.schema';
import { BundleOrderItemListRelationFilterObjectSchema as BundleOrderItemListRelationFilterObjectSchema } from './BundleOrderItemListRelationFilter.schema'

const bundlewhereinputSchema = z.object({
  AND: z.union([z.lazy(() => BundleWhereInputObjectSchema), z.lazy(() => BundleWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => BundleWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => BundleWhereInputObjectSchema), z.lazy(() => BundleWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  orderId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  price: z.union([z.lazy(() => FloatNullableFilterObjectSchema), z.number()]).optional().nullable(),
  numberOfBundles: z.union([z.lazy(() => IntNullableFilterObjectSchema), z.number().int()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  order: z.union([z.lazy(() => OrderNullableScalarRelationFilterObjectSchema), z.lazy(() => OrderWhereInputObjectSchema)]).optional(),
  items: z.lazy(() => BundleItemListRelationFilterObjectSchema).optional(),
  bundleOrderItems: z.lazy(() => BundleOrderItemListRelationFilterObjectSchema).optional()
}).strict();
export const BundleWhereInputObjectSchema: z.ZodType<Prisma.BundleWhereInput> = bundlewhereinputSchema as unknown as z.ZodType<Prisma.BundleWhereInput>;
export const BundleWhereInputObjectZodSchema = bundlewhereinputSchema;

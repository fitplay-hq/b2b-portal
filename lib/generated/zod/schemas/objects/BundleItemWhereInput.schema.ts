import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { IntFilterObjectSchema as IntFilterObjectSchema } from './IntFilter.schema';
import { FloatFilterObjectSchema as FloatFilterObjectSchema } from './FloatFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { BundleScalarRelationFilterObjectSchema as BundleScalarRelationFilterObjectSchema } from './BundleScalarRelationFilter.schema';
import { BundleWhereInputObjectSchema as BundleWhereInputObjectSchema } from './BundleWhereInput.schema';
import { ProductScalarRelationFilterObjectSchema as ProductScalarRelationFilterObjectSchema } from './ProductScalarRelationFilter.schema';
import { ProductWhereInputObjectSchema as ProductWhereInputObjectSchema } from './ProductWhereInput.schema';
import { BundleOrderItemListRelationFilterObjectSchema as BundleOrderItemListRelationFilterObjectSchema } from './BundleOrderItemListRelationFilter.schema'

const bundleitemwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => BundleItemWhereInputObjectSchema), z.lazy(() => BundleItemWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => BundleItemWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => BundleItemWhereInputObjectSchema), z.lazy(() => BundleItemWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  bundleId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  productId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  bundleProductQuantity: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  price: z.union([z.lazy(() => FloatFilterObjectSchema), z.number()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  bundle: z.union([z.lazy(() => BundleScalarRelationFilterObjectSchema), z.lazy(() => BundleWhereInputObjectSchema)]).optional(),
  product: z.union([z.lazy(() => ProductScalarRelationFilterObjectSchema), z.lazy(() => ProductWhereInputObjectSchema)]).optional(),
  bundleOrderItems: z.lazy(() => BundleOrderItemListRelationFilterObjectSchema).optional()
}).strict();
export const BundleItemWhereInputObjectSchema: z.ZodType<Prisma.BundleItemWhereInput> = bundleitemwhereinputSchema as unknown as z.ZodType<Prisma.BundleItemWhereInput>;
export const BundleItemWhereInputObjectZodSchema = bundleitemwhereinputSchema;

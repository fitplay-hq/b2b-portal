import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { IntFilterObjectSchema as IntFilterObjectSchema } from './IntFilter.schema';
import { FloatFilterObjectSchema as FloatFilterObjectSchema } from './FloatFilter.schema';
import { BundleScalarRelationFilterObjectSchema as BundleScalarRelationFilterObjectSchema } from './BundleScalarRelationFilter.schema';
import { BundleWhereInputObjectSchema as BundleWhereInputObjectSchema } from './BundleWhereInput.schema';
import { OrderScalarRelationFilterObjectSchema as OrderScalarRelationFilterObjectSchema } from './OrderScalarRelationFilter.schema';
import { OrderWhereInputObjectSchema as OrderWhereInputObjectSchema } from './OrderWhereInput.schema';
import { ProductScalarRelationFilterObjectSchema as ProductScalarRelationFilterObjectSchema } from './ProductScalarRelationFilter.schema';
import { ProductWhereInputObjectSchema as ProductWhereInputObjectSchema } from './ProductWhereInput.schema';
import { BundleItemListRelationFilterObjectSchema as BundleItemListRelationFilterObjectSchema } from './BundleItemListRelationFilter.schema'

const bundleorderitemwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => BundleOrderItemWhereInputObjectSchema), z.lazy(() => BundleOrderItemWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => BundleOrderItemWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => BundleOrderItemWhereInputObjectSchema), z.lazy(() => BundleOrderItemWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  bundleId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  orderId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  productId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  quantity: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  price: z.union([z.lazy(() => FloatFilterObjectSchema), z.number()]).optional(),
  bundle: z.union([z.lazy(() => BundleScalarRelationFilterObjectSchema), z.lazy(() => BundleWhereInputObjectSchema)]).optional(),
  order: z.union([z.lazy(() => OrderScalarRelationFilterObjectSchema), z.lazy(() => OrderWhereInputObjectSchema)]).optional(),
  product: z.union([z.lazy(() => ProductScalarRelationFilterObjectSchema), z.lazy(() => ProductWhereInputObjectSchema)]).optional(),
  bundleItems: z.lazy(() => BundleItemListRelationFilterObjectSchema).optional()
}).strict();
export const BundleOrderItemWhereInputObjectSchema: z.ZodType<Prisma.BundleOrderItemWhereInput> = bundleorderitemwhereinputSchema as unknown as z.ZodType<Prisma.BundleOrderItemWhereInput>;
export const BundleOrderItemWhereInputObjectZodSchema = bundleorderitemwhereinputSchema;

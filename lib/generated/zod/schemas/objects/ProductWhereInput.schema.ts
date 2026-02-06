import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableListFilterObjectSchema as StringNullableListFilterObjectSchema } from './StringNullableListFilter.schema';
import { IntNullableFilterObjectSchema as IntNullableFilterObjectSchema } from './IntNullableFilter.schema';
import { IntFilterObjectSchema as IntFilterObjectSchema } from './IntFilter.schema';
import { EnumReasonNullableFilterObjectSchema as EnumReasonNullableFilterObjectSchema } from './EnumReasonNullableFilter.schema';
import { ReasonSchema } from '../enums/Reason.schema';
import { EnumCategoryNullableFilterObjectSchema as EnumCategoryNullableFilterObjectSchema } from './EnumCategoryNullableFilter.schema';
import { CategorySchema } from '../enums/Category.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { FloatNullableFilterObjectSchema as FloatNullableFilterObjectSchema } from './FloatNullableFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { ProductCategoryNullableScalarRelationFilterObjectSchema as ProductCategoryNullableScalarRelationFilterObjectSchema } from './ProductCategoryNullableScalarRelationFilter.schema';
import { ProductCategoryWhereInputObjectSchema as ProductCategoryWhereInputObjectSchema } from './ProductCategoryWhereInput.schema';
import { SubCategoryNullableScalarRelationFilterObjectSchema as SubCategoryNullableScalarRelationFilterObjectSchema } from './SubCategoryNullableScalarRelationFilter.schema';
import { SubCategoryWhereInputObjectSchema as SubCategoryWhereInputObjectSchema } from './SubCategoryWhereInput.schema';
import { CompanyListRelationFilterObjectSchema as CompanyListRelationFilterObjectSchema } from './CompanyListRelationFilter.schema';
import { ClientProductListRelationFilterObjectSchema as ClientProductListRelationFilterObjectSchema } from './ClientProductListRelationFilter.schema';
import { OrderItemListRelationFilterObjectSchema as OrderItemListRelationFilterObjectSchema } from './OrderItemListRelationFilter.schema';
import { BundleOrderItemListRelationFilterObjectSchema as BundleOrderItemListRelationFilterObjectSchema } from './BundleOrderItemListRelationFilter.schema';
import { BundleItemListRelationFilterObjectSchema as BundleItemListRelationFilterObjectSchema } from './BundleItemListRelationFilter.schema'

const productwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => ProductWhereInputObjectSchema), z.lazy(() => ProductWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => ProductWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => ProductWhereInputObjectSchema), z.lazy(() => ProductWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringFilterObjectSchema), z.string().max(50)]).optional(),
  images: z.lazy(() => StringNullableListFilterObjectSchema).optional(),
  price: z.union([z.lazy(() => IntNullableFilterObjectSchema), z.number().int()]).optional().nullable(),
  sku: z.union([z.lazy(() => StringFilterObjectSchema), z.string().max(100)]).optional(),
  availableStock: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  minStockThreshold: z.union([z.lazy(() => IntNullableFilterObjectSchema), z.number().int()]).optional().nullable(),
  inventoryUpdateReason: z.union([z.lazy(() => EnumReasonNullableFilterObjectSchema), ReasonSchema]).optional().nullable(),
  inventoryLogs: z.lazy(() => StringNullableListFilterObjectSchema).optional(),
  description: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  categories: z.union([z.lazy(() => EnumCategoryNullableFilterObjectSchema), CategorySchema]).optional().nullable(),
  categoryId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  subCategoryId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  avgRating: z.union([z.lazy(() => FloatNullableFilterObjectSchema), z.number()]).optional().nullable(),
  noOfReviews: z.union([z.lazy(() => IntNullableFilterObjectSchema), z.number().int()]).optional().nullable(),
  brand: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string().max(30)]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  category: z.union([z.lazy(() => ProductCategoryNullableScalarRelationFilterObjectSchema), z.lazy(() => ProductCategoryWhereInputObjectSchema)]).optional(),
  subCategory: z.union([z.lazy(() => SubCategoryNullableScalarRelationFilterObjectSchema), z.lazy(() => SubCategoryWhereInputObjectSchema)]).optional(),
  companies: z.lazy(() => CompanyListRelationFilterObjectSchema).optional(),
  clients: z.lazy(() => ClientProductListRelationFilterObjectSchema).optional(),
  orderItems: z.lazy(() => OrderItemListRelationFilterObjectSchema).optional(),
  bundleOrderItems: z.lazy(() => BundleOrderItemListRelationFilterObjectSchema).optional(),
  bundleItems: z.lazy(() => BundleItemListRelationFilterObjectSchema).optional()
}).strict();
export const ProductWhereInputObjectSchema: z.ZodType<Prisma.ProductWhereInput> = productwhereinputSchema as unknown as z.ZodType<Prisma.ProductWhereInput>;
export const ProductWhereInputObjectZodSchema = productwhereinputSchema;

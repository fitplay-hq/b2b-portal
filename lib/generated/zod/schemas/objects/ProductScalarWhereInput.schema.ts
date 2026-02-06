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
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema'

const productscalarwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => ProductScalarWhereInputObjectSchema), z.lazy(() => ProductScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => ProductScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => ProductScalarWhereInputObjectSchema), z.lazy(() => ProductScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  images: z.lazy(() => StringNullableListFilterObjectSchema).optional(),
  price: z.union([z.lazy(() => IntNullableFilterObjectSchema), z.number().int()]).optional().nullable(),
  sku: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
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
  brand: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const ProductScalarWhereInputObjectSchema: z.ZodType<Prisma.ProductScalarWhereInput> = productscalarwhereinputSchema as unknown as z.ZodType<Prisma.ProductScalarWhereInput>;
export const ProductScalarWhereInputObjectZodSchema = productscalarwhereinputSchema;

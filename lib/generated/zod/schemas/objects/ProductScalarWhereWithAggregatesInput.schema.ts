import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { StringWithAggregatesFilterObjectSchema as StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { StringNullableListFilterObjectSchema as StringNullableListFilterObjectSchema } from './StringNullableListFilter.schema';
import { IntNullableWithAggregatesFilterObjectSchema as IntNullableWithAggregatesFilterObjectSchema } from './IntNullableWithAggregatesFilter.schema';
import { IntWithAggregatesFilterObjectSchema as IntWithAggregatesFilterObjectSchema } from './IntWithAggregatesFilter.schema';
import { EnumReasonNullableWithAggregatesFilterObjectSchema as EnumReasonNullableWithAggregatesFilterObjectSchema } from './EnumReasonNullableWithAggregatesFilter.schema';
import { ReasonSchema } from '../enums/Reason.schema';
import { EnumCategoryNullableWithAggregatesFilterObjectSchema as EnumCategoryNullableWithAggregatesFilterObjectSchema } from './EnumCategoryNullableWithAggregatesFilter.schema';
import { CategorySchema } from '../enums/Category.schema';
import { StringNullableWithAggregatesFilterObjectSchema as StringNullableWithAggregatesFilterObjectSchema } from './StringNullableWithAggregatesFilter.schema';
import { FloatNullableWithAggregatesFilterObjectSchema as FloatNullableWithAggregatesFilterObjectSchema } from './FloatNullableWithAggregatesFilter.schema';
import { DateTimeWithAggregatesFilterObjectSchema as DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema'

const productscalarwherewithaggregatesinputSchema = z.object({
  AND: z.union([z.lazy(() => ProductScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => ProductScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => ProductScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => ProductScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => ProductScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string().max(50)]).optional(),
  images: z.lazy(() => StringNullableListFilterObjectSchema).optional(),
  price: z.union([z.lazy(() => IntNullableWithAggregatesFilterObjectSchema), z.number().int()]).optional().nullable(),
  sku: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string().max(100)]).optional(),
  availableStock: z.union([z.lazy(() => IntWithAggregatesFilterObjectSchema), z.number().int()]).optional(),
  minStockThreshold: z.union([z.lazy(() => IntNullableWithAggregatesFilterObjectSchema), z.number().int()]).optional().nullable(),
  inventoryUpdateReason: z.union([z.lazy(() => EnumReasonNullableWithAggregatesFilterObjectSchema), ReasonSchema]).optional().nullable(),
  inventoryLogs: z.lazy(() => StringNullableListFilterObjectSchema).optional(),
  description: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  categories: z.union([z.lazy(() => EnumCategoryNullableWithAggregatesFilterObjectSchema), CategorySchema]).optional().nullable(),
  categoryId: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  subCategoryId: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  avgRating: z.union([z.lazy(() => FloatNullableWithAggregatesFilterObjectSchema), z.number()]).optional().nullable(),
  noOfReviews: z.union([z.lazy(() => IntNullableWithAggregatesFilterObjectSchema), z.number().int()]).optional().nullable(),
  brand: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string().max(30)]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const ProductScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.ProductScalarWhereWithAggregatesInput> = productscalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.ProductScalarWhereWithAggregatesInput>;
export const ProductScalarWhereWithAggregatesInputObjectZodSchema = productscalarwherewithaggregatesinputSchema;

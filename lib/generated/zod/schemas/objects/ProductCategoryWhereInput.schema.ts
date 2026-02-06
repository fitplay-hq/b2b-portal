import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { BoolFilterObjectSchema as BoolFilterObjectSchema } from './BoolFilter.schema';
import { IntFilterObjectSchema as IntFilterObjectSchema } from './IntFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { ProductListRelationFilterObjectSchema as ProductListRelationFilterObjectSchema } from './ProductListRelationFilter.schema';
import { SubCategoryListRelationFilterObjectSchema as SubCategoryListRelationFilterObjectSchema } from './SubCategoryListRelationFilter.schema'

const productcategorywhereinputSchema = z.object({
  AND: z.union([z.lazy(() => ProductCategoryWhereInputObjectSchema), z.lazy(() => ProductCategoryWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => ProductCategoryWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => ProductCategoryWhereInputObjectSchema), z.lazy(() => ProductCategoryWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringFilterObjectSchema), z.string().max(50)]).optional(),
  displayName: z.union([z.lazy(() => StringFilterObjectSchema), z.string().max(100)]).optional(),
  description: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string().max(255)]).optional().nullable(),
  shortCode: z.union([z.lazy(() => StringFilterObjectSchema), z.string().max(10)]).optional(),
  isActive: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
  sortOrder: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  products: z.lazy(() => ProductListRelationFilterObjectSchema).optional(),
  subCategories: z.lazy(() => SubCategoryListRelationFilterObjectSchema).optional()
}).strict();
export const ProductCategoryWhereInputObjectSchema: z.ZodType<Prisma.ProductCategoryWhereInput> = productcategorywhereinputSchema as unknown as z.ZodType<Prisma.ProductCategoryWhereInput>;
export const ProductCategoryWhereInputObjectZodSchema = productcategorywhereinputSchema;

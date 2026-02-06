import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { ProductCategoryScalarRelationFilterObjectSchema as ProductCategoryScalarRelationFilterObjectSchema } from './ProductCategoryScalarRelationFilter.schema';
import { ProductCategoryWhereInputObjectSchema as ProductCategoryWhereInputObjectSchema } from './ProductCategoryWhereInput.schema';
import { ProductListRelationFilterObjectSchema as ProductListRelationFilterObjectSchema } from './ProductListRelationFilter.schema'

const subcategorywhereinputSchema = z.object({
  AND: z.union([z.lazy(() => SubCategoryWhereInputObjectSchema), z.lazy(() => SubCategoryWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => SubCategoryWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => SubCategoryWhereInputObjectSchema), z.lazy(() => SubCategoryWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  categoryId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  shortCode: z.union([z.lazy(() => StringFilterObjectSchema), z.string().max(10)]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  category: z.union([z.lazy(() => ProductCategoryScalarRelationFilterObjectSchema), z.lazy(() => ProductCategoryWhereInputObjectSchema)]).optional(),
  products: z.lazy(() => ProductListRelationFilterObjectSchema).optional()
}).strict();
export const SubCategoryWhereInputObjectSchema: z.ZodType<Prisma.SubCategoryWhereInput> = subcategorywhereinputSchema as unknown as z.ZodType<Prisma.SubCategoryWhereInput>;
export const SubCategoryWhereInputObjectZodSchema = subcategorywhereinputSchema;

import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { StringWithAggregatesFilterObjectSchema as StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { DateTimeWithAggregatesFilterObjectSchema as DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema'

const subcategoryscalarwherewithaggregatesinputSchema = z.object({
  AND: z.union([z.lazy(() => SubCategoryScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => SubCategoryScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => SubCategoryScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => SubCategoryScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => SubCategoryScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  categoryId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  shortCode: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string().max(10)]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const SubCategoryScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.SubCategoryScalarWhereWithAggregatesInput> = subcategoryscalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.SubCategoryScalarWhereWithAggregatesInput>;
export const SubCategoryScalarWhereWithAggregatesInputObjectZodSchema = subcategoryscalarwherewithaggregatesinputSchema;

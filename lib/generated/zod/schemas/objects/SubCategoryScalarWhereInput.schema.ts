import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema'

const subcategoryscalarwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => SubCategoryScalarWhereInputObjectSchema), z.lazy(() => SubCategoryScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => SubCategoryScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => SubCategoryScalarWhereInputObjectSchema), z.lazy(() => SubCategoryScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  categoryId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  shortCode: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const SubCategoryScalarWhereInputObjectSchema: z.ZodType<Prisma.SubCategoryScalarWhereInput> = subcategoryscalarwhereinputSchema as unknown as z.ZodType<Prisma.SubCategoryScalarWhereInput>;
export const SubCategoryScalarWhereInputObjectZodSchema = subcategoryscalarwhereinputSchema;

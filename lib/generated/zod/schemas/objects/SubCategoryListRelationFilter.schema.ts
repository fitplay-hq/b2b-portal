import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SubCategoryWhereInputObjectSchema as SubCategoryWhereInputObjectSchema } from './SubCategoryWhereInput.schema'

const makeSchema = () => z.object({
  every: z.lazy(() => SubCategoryWhereInputObjectSchema).optional(),
  some: z.lazy(() => SubCategoryWhereInputObjectSchema).optional(),
  none: z.lazy(() => SubCategoryWhereInputObjectSchema).optional()
}).strict();
export const SubCategoryListRelationFilterObjectSchema: z.ZodType<Prisma.SubCategoryListRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.SubCategoryListRelationFilter>;
export const SubCategoryListRelationFilterObjectZodSchema = makeSchema();

import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { SubCategoryCreateManyInputObjectSchema as SubCategoryCreateManyInputObjectSchema } from './objects/SubCategoryCreateManyInput.schema';

export const SubCategoryCreateManySchema: z.ZodType<Prisma.SubCategoryCreateManyArgs> = z.object({ data: z.union([ SubCategoryCreateManyInputObjectSchema, z.array(SubCategoryCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.SubCategoryCreateManyArgs>;

export const SubCategoryCreateManyZodSchema = z.object({ data: z.union([ SubCategoryCreateManyInputObjectSchema, z.array(SubCategoryCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();
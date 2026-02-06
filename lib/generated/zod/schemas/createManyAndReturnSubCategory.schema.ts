import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { SubCategorySelectObjectSchema as SubCategorySelectObjectSchema } from './objects/SubCategorySelect.schema';
import { SubCategoryCreateManyInputObjectSchema as SubCategoryCreateManyInputObjectSchema } from './objects/SubCategoryCreateManyInput.schema';

export const SubCategoryCreateManyAndReturnSchema: z.ZodType<Prisma.SubCategoryCreateManyAndReturnArgs> = z.object({ select: SubCategorySelectObjectSchema.optional(), data: z.union([ SubCategoryCreateManyInputObjectSchema, z.array(SubCategoryCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.SubCategoryCreateManyAndReturnArgs>;

export const SubCategoryCreateManyAndReturnZodSchema = z.object({ select: SubCategorySelectObjectSchema.optional(), data: z.union([ SubCategoryCreateManyInputObjectSchema, z.array(SubCategoryCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();
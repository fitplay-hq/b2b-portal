import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { SubCategorySelectObjectSchema as SubCategorySelectObjectSchema } from './objects/SubCategorySelect.schema';
import { SubCategoryIncludeObjectSchema as SubCategoryIncludeObjectSchema } from './objects/SubCategoryInclude.schema';
import { SubCategoryCreateInputObjectSchema as SubCategoryCreateInputObjectSchema } from './objects/SubCategoryCreateInput.schema';
import { SubCategoryUncheckedCreateInputObjectSchema as SubCategoryUncheckedCreateInputObjectSchema } from './objects/SubCategoryUncheckedCreateInput.schema';

export const SubCategoryCreateOneSchema: z.ZodType<Prisma.SubCategoryCreateArgs> = z.object({ select: SubCategorySelectObjectSchema.optional(), include: SubCategoryIncludeObjectSchema.optional(), data: z.union([SubCategoryCreateInputObjectSchema, SubCategoryUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.SubCategoryCreateArgs>;

export const SubCategoryCreateOneZodSchema = z.object({ select: SubCategorySelectObjectSchema.optional(), include: SubCategoryIncludeObjectSchema.optional(), data: z.union([SubCategoryCreateInputObjectSchema, SubCategoryUncheckedCreateInputObjectSchema]) }).strict();
import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { SubCategorySelectObjectSchema as SubCategorySelectObjectSchema } from './objects/SubCategorySelect.schema';
import { SubCategoryIncludeObjectSchema as SubCategoryIncludeObjectSchema } from './objects/SubCategoryInclude.schema';
import { SubCategoryUpdateInputObjectSchema as SubCategoryUpdateInputObjectSchema } from './objects/SubCategoryUpdateInput.schema';
import { SubCategoryUncheckedUpdateInputObjectSchema as SubCategoryUncheckedUpdateInputObjectSchema } from './objects/SubCategoryUncheckedUpdateInput.schema';
import { SubCategoryWhereUniqueInputObjectSchema as SubCategoryWhereUniqueInputObjectSchema } from './objects/SubCategoryWhereUniqueInput.schema';

export const SubCategoryUpdateOneSchema: z.ZodType<Prisma.SubCategoryUpdateArgs> = z.object({ select: SubCategorySelectObjectSchema.optional(), include: SubCategoryIncludeObjectSchema.optional(), data: z.union([SubCategoryUpdateInputObjectSchema, SubCategoryUncheckedUpdateInputObjectSchema]), where: SubCategoryWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.SubCategoryUpdateArgs>;

export const SubCategoryUpdateOneZodSchema = z.object({ select: SubCategorySelectObjectSchema.optional(), include: SubCategoryIncludeObjectSchema.optional(), data: z.union([SubCategoryUpdateInputObjectSchema, SubCategoryUncheckedUpdateInputObjectSchema]), where: SubCategoryWhereUniqueInputObjectSchema }).strict();
import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { SubCategorySelectObjectSchema as SubCategorySelectObjectSchema } from './objects/SubCategorySelect.schema';
import { SubCategoryIncludeObjectSchema as SubCategoryIncludeObjectSchema } from './objects/SubCategoryInclude.schema';
import { SubCategoryWhereUniqueInputObjectSchema as SubCategoryWhereUniqueInputObjectSchema } from './objects/SubCategoryWhereUniqueInput.schema';
import { SubCategoryCreateInputObjectSchema as SubCategoryCreateInputObjectSchema } from './objects/SubCategoryCreateInput.schema';
import { SubCategoryUncheckedCreateInputObjectSchema as SubCategoryUncheckedCreateInputObjectSchema } from './objects/SubCategoryUncheckedCreateInput.schema';
import { SubCategoryUpdateInputObjectSchema as SubCategoryUpdateInputObjectSchema } from './objects/SubCategoryUpdateInput.schema';
import { SubCategoryUncheckedUpdateInputObjectSchema as SubCategoryUncheckedUpdateInputObjectSchema } from './objects/SubCategoryUncheckedUpdateInput.schema';

export const SubCategoryUpsertOneSchema: z.ZodType<Prisma.SubCategoryUpsertArgs> = z.object({ select: SubCategorySelectObjectSchema.optional(), include: SubCategoryIncludeObjectSchema.optional(), where: SubCategoryWhereUniqueInputObjectSchema, create: z.union([ SubCategoryCreateInputObjectSchema, SubCategoryUncheckedCreateInputObjectSchema ]), update: z.union([ SubCategoryUpdateInputObjectSchema, SubCategoryUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.SubCategoryUpsertArgs>;

export const SubCategoryUpsertOneZodSchema = z.object({ select: SubCategorySelectObjectSchema.optional(), include: SubCategoryIncludeObjectSchema.optional(), where: SubCategoryWhereUniqueInputObjectSchema, create: z.union([ SubCategoryCreateInputObjectSchema, SubCategoryUncheckedCreateInputObjectSchema ]), update: z.union([ SubCategoryUpdateInputObjectSchema, SubCategoryUncheckedUpdateInputObjectSchema ]) }).strict();
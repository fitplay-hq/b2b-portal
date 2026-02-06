import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { SubCategorySelectObjectSchema as SubCategorySelectObjectSchema } from './objects/SubCategorySelect.schema';
import { SubCategoryIncludeObjectSchema as SubCategoryIncludeObjectSchema } from './objects/SubCategoryInclude.schema';
import { SubCategoryWhereUniqueInputObjectSchema as SubCategoryWhereUniqueInputObjectSchema } from './objects/SubCategoryWhereUniqueInput.schema';

export const SubCategoryFindUniqueOrThrowSchema: z.ZodType<Prisma.SubCategoryFindUniqueOrThrowArgs> = z.object({ select: SubCategorySelectObjectSchema.optional(), include: SubCategoryIncludeObjectSchema.optional(), where: SubCategoryWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.SubCategoryFindUniqueOrThrowArgs>;

export const SubCategoryFindUniqueOrThrowZodSchema = z.object({ select: SubCategorySelectObjectSchema.optional(), include: SubCategoryIncludeObjectSchema.optional(), where: SubCategoryWhereUniqueInputObjectSchema }).strict();
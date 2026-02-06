import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { SubCategorySelectObjectSchema as SubCategorySelectObjectSchema } from './objects/SubCategorySelect.schema';
import { SubCategoryIncludeObjectSchema as SubCategoryIncludeObjectSchema } from './objects/SubCategoryInclude.schema';
import { SubCategoryWhereUniqueInputObjectSchema as SubCategoryWhereUniqueInputObjectSchema } from './objects/SubCategoryWhereUniqueInput.schema';

export const SubCategoryFindUniqueSchema: z.ZodType<Prisma.SubCategoryFindUniqueArgs> = z.object({ select: SubCategorySelectObjectSchema.optional(), include: SubCategoryIncludeObjectSchema.optional(), where: SubCategoryWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.SubCategoryFindUniqueArgs>;

export const SubCategoryFindUniqueZodSchema = z.object({ select: SubCategorySelectObjectSchema.optional(), include: SubCategoryIncludeObjectSchema.optional(), where: SubCategoryWhereUniqueInputObjectSchema }).strict();
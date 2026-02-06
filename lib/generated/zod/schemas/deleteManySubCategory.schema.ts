import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { SubCategoryWhereInputObjectSchema as SubCategoryWhereInputObjectSchema } from './objects/SubCategoryWhereInput.schema';

export const SubCategoryDeleteManySchema: z.ZodType<Prisma.SubCategoryDeleteManyArgs> = z.object({ where: SubCategoryWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.SubCategoryDeleteManyArgs>;

export const SubCategoryDeleteManyZodSchema = z.object({ where: SubCategoryWhereInputObjectSchema.optional() }).strict();
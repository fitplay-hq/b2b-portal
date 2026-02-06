import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { SubCategoryUpdateManyMutationInputObjectSchema as SubCategoryUpdateManyMutationInputObjectSchema } from './objects/SubCategoryUpdateManyMutationInput.schema';
import { SubCategoryWhereInputObjectSchema as SubCategoryWhereInputObjectSchema } from './objects/SubCategoryWhereInput.schema';

export const SubCategoryUpdateManySchema: z.ZodType<Prisma.SubCategoryUpdateManyArgs> = z.object({ data: SubCategoryUpdateManyMutationInputObjectSchema, where: SubCategoryWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.SubCategoryUpdateManyArgs>;

export const SubCategoryUpdateManyZodSchema = z.object({ data: SubCategoryUpdateManyMutationInputObjectSchema, where: SubCategoryWhereInputObjectSchema.optional() }).strict();
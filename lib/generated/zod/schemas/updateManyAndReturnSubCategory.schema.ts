import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { SubCategorySelectObjectSchema as SubCategorySelectObjectSchema } from './objects/SubCategorySelect.schema';
import { SubCategoryUpdateManyMutationInputObjectSchema as SubCategoryUpdateManyMutationInputObjectSchema } from './objects/SubCategoryUpdateManyMutationInput.schema';
import { SubCategoryWhereInputObjectSchema as SubCategoryWhereInputObjectSchema } from './objects/SubCategoryWhereInput.schema';

export const SubCategoryUpdateManyAndReturnSchema: z.ZodType<Prisma.SubCategoryUpdateManyAndReturnArgs> = z.object({ select: SubCategorySelectObjectSchema.optional(), data: SubCategoryUpdateManyMutationInputObjectSchema, where: SubCategoryWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.SubCategoryUpdateManyAndReturnArgs>;

export const SubCategoryUpdateManyAndReturnZodSchema = z.object({ select: SubCategorySelectObjectSchema.optional(), data: SubCategoryUpdateManyMutationInputObjectSchema, where: SubCategoryWhereInputObjectSchema.optional() }).strict();
import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { ProductCategorySelectObjectSchema as ProductCategorySelectObjectSchema } from './objects/ProductCategorySelect.schema';
import { ProductCategoryUpdateManyMutationInputObjectSchema as ProductCategoryUpdateManyMutationInputObjectSchema } from './objects/ProductCategoryUpdateManyMutationInput.schema';
import { ProductCategoryWhereInputObjectSchema as ProductCategoryWhereInputObjectSchema } from './objects/ProductCategoryWhereInput.schema';

export const ProductCategoryUpdateManyAndReturnSchema: z.ZodType<Prisma.ProductCategoryUpdateManyAndReturnArgs> = z.object({ select: ProductCategorySelectObjectSchema.optional(), data: ProductCategoryUpdateManyMutationInputObjectSchema, where: ProductCategoryWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.ProductCategoryUpdateManyAndReturnArgs>;

export const ProductCategoryUpdateManyAndReturnZodSchema = z.object({ select: ProductCategorySelectObjectSchema.optional(), data: ProductCategoryUpdateManyMutationInputObjectSchema, where: ProductCategoryWhereInputObjectSchema.optional() }).strict();
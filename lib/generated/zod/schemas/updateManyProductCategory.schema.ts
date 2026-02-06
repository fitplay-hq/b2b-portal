import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { ProductCategoryUpdateManyMutationInputObjectSchema as ProductCategoryUpdateManyMutationInputObjectSchema } from './objects/ProductCategoryUpdateManyMutationInput.schema';
import { ProductCategoryWhereInputObjectSchema as ProductCategoryWhereInputObjectSchema } from './objects/ProductCategoryWhereInput.schema';

export const ProductCategoryUpdateManySchema: z.ZodType<Prisma.ProductCategoryUpdateManyArgs> = z.object({ data: ProductCategoryUpdateManyMutationInputObjectSchema, where: ProductCategoryWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.ProductCategoryUpdateManyArgs>;

export const ProductCategoryUpdateManyZodSchema = z.object({ data: ProductCategoryUpdateManyMutationInputObjectSchema, where: ProductCategoryWhereInputObjectSchema.optional() }).strict();
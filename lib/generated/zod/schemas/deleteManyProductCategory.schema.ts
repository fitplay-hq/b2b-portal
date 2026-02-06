import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { ProductCategoryWhereInputObjectSchema as ProductCategoryWhereInputObjectSchema } from './objects/ProductCategoryWhereInput.schema';

export const ProductCategoryDeleteManySchema: z.ZodType<Prisma.ProductCategoryDeleteManyArgs> = z.object({ where: ProductCategoryWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.ProductCategoryDeleteManyArgs>;

export const ProductCategoryDeleteManyZodSchema = z.object({ where: ProductCategoryWhereInputObjectSchema.optional() }).strict();
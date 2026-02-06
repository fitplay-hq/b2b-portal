import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { ProductCategorySelectObjectSchema as ProductCategorySelectObjectSchema } from './objects/ProductCategorySelect.schema';
import { ProductCategoryIncludeObjectSchema as ProductCategoryIncludeObjectSchema } from './objects/ProductCategoryInclude.schema';
import { ProductCategoryUpdateInputObjectSchema as ProductCategoryUpdateInputObjectSchema } from './objects/ProductCategoryUpdateInput.schema';
import { ProductCategoryUncheckedUpdateInputObjectSchema as ProductCategoryUncheckedUpdateInputObjectSchema } from './objects/ProductCategoryUncheckedUpdateInput.schema';
import { ProductCategoryWhereUniqueInputObjectSchema as ProductCategoryWhereUniqueInputObjectSchema } from './objects/ProductCategoryWhereUniqueInput.schema';

export const ProductCategoryUpdateOneSchema: z.ZodType<Prisma.ProductCategoryUpdateArgs> = z.object({ select: ProductCategorySelectObjectSchema.optional(), include: ProductCategoryIncludeObjectSchema.optional(), data: z.union([ProductCategoryUpdateInputObjectSchema, ProductCategoryUncheckedUpdateInputObjectSchema]), where: ProductCategoryWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.ProductCategoryUpdateArgs>;

export const ProductCategoryUpdateOneZodSchema = z.object({ select: ProductCategorySelectObjectSchema.optional(), include: ProductCategoryIncludeObjectSchema.optional(), data: z.union([ProductCategoryUpdateInputObjectSchema, ProductCategoryUncheckedUpdateInputObjectSchema]), where: ProductCategoryWhereUniqueInputObjectSchema }).strict();
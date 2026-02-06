import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { ProductCategorySelectObjectSchema as ProductCategorySelectObjectSchema } from './objects/ProductCategorySelect.schema';
import { ProductCategoryIncludeObjectSchema as ProductCategoryIncludeObjectSchema } from './objects/ProductCategoryInclude.schema';
import { ProductCategoryWhereUniqueInputObjectSchema as ProductCategoryWhereUniqueInputObjectSchema } from './objects/ProductCategoryWhereUniqueInput.schema';

export const ProductCategoryDeleteOneSchema: z.ZodType<Prisma.ProductCategoryDeleteArgs> = z.object({ select: ProductCategorySelectObjectSchema.optional(), include: ProductCategoryIncludeObjectSchema.optional(), where: ProductCategoryWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.ProductCategoryDeleteArgs>;

export const ProductCategoryDeleteOneZodSchema = z.object({ select: ProductCategorySelectObjectSchema.optional(), include: ProductCategoryIncludeObjectSchema.optional(), where: ProductCategoryWhereUniqueInputObjectSchema }).strict();
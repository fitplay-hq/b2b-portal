import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { ProductCategorySelectObjectSchema as ProductCategorySelectObjectSchema } from './objects/ProductCategorySelect.schema';
import { ProductCategoryIncludeObjectSchema as ProductCategoryIncludeObjectSchema } from './objects/ProductCategoryInclude.schema';
import { ProductCategoryCreateInputObjectSchema as ProductCategoryCreateInputObjectSchema } from './objects/ProductCategoryCreateInput.schema';
import { ProductCategoryUncheckedCreateInputObjectSchema as ProductCategoryUncheckedCreateInputObjectSchema } from './objects/ProductCategoryUncheckedCreateInput.schema';

export const ProductCategoryCreateOneSchema: z.ZodType<Prisma.ProductCategoryCreateArgs> = z.object({ select: ProductCategorySelectObjectSchema.optional(), include: ProductCategoryIncludeObjectSchema.optional(), data: z.union([ProductCategoryCreateInputObjectSchema, ProductCategoryUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.ProductCategoryCreateArgs>;

export const ProductCategoryCreateOneZodSchema = z.object({ select: ProductCategorySelectObjectSchema.optional(), include: ProductCategoryIncludeObjectSchema.optional(), data: z.union([ProductCategoryCreateInputObjectSchema, ProductCategoryUncheckedCreateInputObjectSchema]) }).strict();
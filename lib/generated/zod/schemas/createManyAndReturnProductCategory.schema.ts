import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { ProductCategorySelectObjectSchema as ProductCategorySelectObjectSchema } from './objects/ProductCategorySelect.schema';
import { ProductCategoryCreateManyInputObjectSchema as ProductCategoryCreateManyInputObjectSchema } from './objects/ProductCategoryCreateManyInput.schema';

export const ProductCategoryCreateManyAndReturnSchema: z.ZodType<Prisma.ProductCategoryCreateManyAndReturnArgs> = z.object({ select: ProductCategorySelectObjectSchema.optional(), data: z.union([ ProductCategoryCreateManyInputObjectSchema, z.array(ProductCategoryCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.ProductCategoryCreateManyAndReturnArgs>;

export const ProductCategoryCreateManyAndReturnZodSchema = z.object({ select: ProductCategorySelectObjectSchema.optional(), data: z.union([ ProductCategoryCreateManyInputObjectSchema, z.array(ProductCategoryCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();
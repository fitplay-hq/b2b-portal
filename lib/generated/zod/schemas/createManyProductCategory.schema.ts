import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { ProductCategoryCreateManyInputObjectSchema as ProductCategoryCreateManyInputObjectSchema } from './objects/ProductCategoryCreateManyInput.schema';

export const ProductCategoryCreateManySchema: z.ZodType<Prisma.ProductCategoryCreateManyArgs> = z.object({ data: z.union([ ProductCategoryCreateManyInputObjectSchema, z.array(ProductCategoryCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.ProductCategoryCreateManyArgs>;

export const ProductCategoryCreateManyZodSchema = z.object({ data: z.union([ ProductCategoryCreateManyInputObjectSchema, z.array(ProductCategoryCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();
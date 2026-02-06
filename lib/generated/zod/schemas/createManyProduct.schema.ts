import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { ProductCreateManyInputObjectSchema as ProductCreateManyInputObjectSchema } from './objects/ProductCreateManyInput.schema';

export const ProductCreateManySchema: z.ZodType<Prisma.ProductCreateManyArgs> = z.object({ data: z.union([ ProductCreateManyInputObjectSchema, z.array(ProductCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.ProductCreateManyArgs>;

export const ProductCreateManyZodSchema = z.object({ data: z.union([ ProductCreateManyInputObjectSchema, z.array(ProductCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();
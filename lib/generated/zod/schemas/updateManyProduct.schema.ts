import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { ProductUpdateManyMutationInputObjectSchema as ProductUpdateManyMutationInputObjectSchema } from './objects/ProductUpdateManyMutationInput.schema';
import { ProductWhereInputObjectSchema as ProductWhereInputObjectSchema } from './objects/ProductWhereInput.schema';

export const ProductUpdateManySchema: z.ZodType<Prisma.ProductUpdateManyArgs> = z.object({ data: ProductUpdateManyMutationInputObjectSchema, where: ProductWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.ProductUpdateManyArgs>;

export const ProductUpdateManyZodSchema = z.object({ data: ProductUpdateManyMutationInputObjectSchema, where: ProductWhereInputObjectSchema.optional() }).strict();
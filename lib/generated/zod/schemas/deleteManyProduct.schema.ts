import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { ProductWhereInputObjectSchema as ProductWhereInputObjectSchema } from './objects/ProductWhereInput.schema';

export const ProductDeleteManySchema: z.ZodType<Prisma.ProductDeleteManyArgs> = z.object({ where: ProductWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.ProductDeleteManyArgs>;

export const ProductDeleteManyZodSchema = z.object({ where: ProductWhereInputObjectSchema.optional() }).strict();
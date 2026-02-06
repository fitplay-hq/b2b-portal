import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { ProductSelectObjectSchema as ProductSelectObjectSchema } from './objects/ProductSelect.schema';
import { ProductIncludeObjectSchema as ProductIncludeObjectSchema } from './objects/ProductInclude.schema';
import { ProductWhereUniqueInputObjectSchema as ProductWhereUniqueInputObjectSchema } from './objects/ProductWhereUniqueInput.schema';

export const ProductDeleteOneSchema: z.ZodType<Prisma.ProductDeleteArgs> = z.object({ select: ProductSelectObjectSchema.optional(), include: ProductIncludeObjectSchema.optional(), where: ProductWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.ProductDeleteArgs>;

export const ProductDeleteOneZodSchema = z.object({ select: ProductSelectObjectSchema.optional(), include: ProductIncludeObjectSchema.optional(), where: ProductWhereUniqueInputObjectSchema }).strict();
import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { ProductSelectObjectSchema as ProductSelectObjectSchema } from './objects/ProductSelect.schema';
import { ProductIncludeObjectSchema as ProductIncludeObjectSchema } from './objects/ProductInclude.schema';
import { ProductUpdateInputObjectSchema as ProductUpdateInputObjectSchema } from './objects/ProductUpdateInput.schema';
import { ProductUncheckedUpdateInputObjectSchema as ProductUncheckedUpdateInputObjectSchema } from './objects/ProductUncheckedUpdateInput.schema';
import { ProductWhereUniqueInputObjectSchema as ProductWhereUniqueInputObjectSchema } from './objects/ProductWhereUniqueInput.schema';

export const ProductUpdateOneSchema: z.ZodType<Prisma.ProductUpdateArgs> = z.object({ select: ProductSelectObjectSchema.optional(), include: ProductIncludeObjectSchema.optional(), data: z.union([ProductUpdateInputObjectSchema, ProductUncheckedUpdateInputObjectSchema]), where: ProductWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.ProductUpdateArgs>;

export const ProductUpdateOneZodSchema = z.object({ select: ProductSelectObjectSchema.optional(), include: ProductIncludeObjectSchema.optional(), data: z.union([ProductUpdateInputObjectSchema, ProductUncheckedUpdateInputObjectSchema]), where: ProductWhereUniqueInputObjectSchema }).strict();
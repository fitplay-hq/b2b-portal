import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { ProductSelectObjectSchema as ProductSelectObjectSchema } from './objects/ProductSelect.schema';
import { ProductIncludeObjectSchema as ProductIncludeObjectSchema } from './objects/ProductInclude.schema';
import { ProductWhereUniqueInputObjectSchema as ProductWhereUniqueInputObjectSchema } from './objects/ProductWhereUniqueInput.schema';
import { ProductCreateInputObjectSchema as ProductCreateInputObjectSchema } from './objects/ProductCreateInput.schema';
import { ProductUncheckedCreateInputObjectSchema as ProductUncheckedCreateInputObjectSchema } from './objects/ProductUncheckedCreateInput.schema';
import { ProductUpdateInputObjectSchema as ProductUpdateInputObjectSchema } from './objects/ProductUpdateInput.schema';
import { ProductUncheckedUpdateInputObjectSchema as ProductUncheckedUpdateInputObjectSchema } from './objects/ProductUncheckedUpdateInput.schema';

export const ProductUpsertOneSchema: z.ZodType<Prisma.ProductUpsertArgs> = z.object({ select: ProductSelectObjectSchema.optional(), include: ProductIncludeObjectSchema.optional(), where: ProductWhereUniqueInputObjectSchema, create: z.union([ ProductCreateInputObjectSchema, ProductUncheckedCreateInputObjectSchema ]), update: z.union([ ProductUpdateInputObjectSchema, ProductUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.ProductUpsertArgs>;

export const ProductUpsertOneZodSchema = z.object({ select: ProductSelectObjectSchema.optional(), include: ProductIncludeObjectSchema.optional(), where: ProductWhereUniqueInputObjectSchema, create: z.union([ ProductCreateInputObjectSchema, ProductUncheckedCreateInputObjectSchema ]), update: z.union([ ProductUpdateInputObjectSchema, ProductUncheckedUpdateInputObjectSchema ]) }).strict();
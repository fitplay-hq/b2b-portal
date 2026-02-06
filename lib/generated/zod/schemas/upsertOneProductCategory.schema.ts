import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { ProductCategorySelectObjectSchema as ProductCategorySelectObjectSchema } from './objects/ProductCategorySelect.schema';
import { ProductCategoryIncludeObjectSchema as ProductCategoryIncludeObjectSchema } from './objects/ProductCategoryInclude.schema';
import { ProductCategoryWhereUniqueInputObjectSchema as ProductCategoryWhereUniqueInputObjectSchema } from './objects/ProductCategoryWhereUniqueInput.schema';
import { ProductCategoryCreateInputObjectSchema as ProductCategoryCreateInputObjectSchema } from './objects/ProductCategoryCreateInput.schema';
import { ProductCategoryUncheckedCreateInputObjectSchema as ProductCategoryUncheckedCreateInputObjectSchema } from './objects/ProductCategoryUncheckedCreateInput.schema';
import { ProductCategoryUpdateInputObjectSchema as ProductCategoryUpdateInputObjectSchema } from './objects/ProductCategoryUpdateInput.schema';
import { ProductCategoryUncheckedUpdateInputObjectSchema as ProductCategoryUncheckedUpdateInputObjectSchema } from './objects/ProductCategoryUncheckedUpdateInput.schema';

export const ProductCategoryUpsertOneSchema: z.ZodType<Prisma.ProductCategoryUpsertArgs> = z.object({ select: ProductCategorySelectObjectSchema.optional(), include: ProductCategoryIncludeObjectSchema.optional(), where: ProductCategoryWhereUniqueInputObjectSchema, create: z.union([ ProductCategoryCreateInputObjectSchema, ProductCategoryUncheckedCreateInputObjectSchema ]), update: z.union([ ProductCategoryUpdateInputObjectSchema, ProductCategoryUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.ProductCategoryUpsertArgs>;

export const ProductCategoryUpsertOneZodSchema = z.object({ select: ProductCategorySelectObjectSchema.optional(), include: ProductCategoryIncludeObjectSchema.optional(), where: ProductCategoryWhereUniqueInputObjectSchema, create: z.union([ ProductCategoryCreateInputObjectSchema, ProductCategoryUncheckedCreateInputObjectSchema ]), update: z.union([ ProductCategoryUpdateInputObjectSchema, ProductCategoryUncheckedUpdateInputObjectSchema ]) }).strict();
import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { ProductSelectObjectSchema as ProductSelectObjectSchema } from './objects/ProductSelect.schema';
import { ProductUpdateManyMutationInputObjectSchema as ProductUpdateManyMutationInputObjectSchema } from './objects/ProductUpdateManyMutationInput.schema';
import { ProductWhereInputObjectSchema as ProductWhereInputObjectSchema } from './objects/ProductWhereInput.schema';

export const ProductUpdateManyAndReturnSchema: z.ZodType<Prisma.ProductUpdateManyAndReturnArgs> = z.object({ select: ProductSelectObjectSchema.optional(), data: ProductUpdateManyMutationInputObjectSchema, where: ProductWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.ProductUpdateManyAndReturnArgs>;

export const ProductUpdateManyAndReturnZodSchema = z.object({ select: ProductSelectObjectSchema.optional(), data: ProductUpdateManyMutationInputObjectSchema, where: ProductWhereInputObjectSchema.optional() }).strict();
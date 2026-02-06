import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { ProductOrderByWithRelationInputObjectSchema as ProductOrderByWithRelationInputObjectSchema } from './objects/ProductOrderByWithRelationInput.schema';
import { ProductWhereInputObjectSchema as ProductWhereInputObjectSchema } from './objects/ProductWhereInput.schema';
import { ProductWhereUniqueInputObjectSchema as ProductWhereUniqueInputObjectSchema } from './objects/ProductWhereUniqueInput.schema';
import { ProductCountAggregateInputObjectSchema as ProductCountAggregateInputObjectSchema } from './objects/ProductCountAggregateInput.schema';

export const ProductCountSchema: z.ZodType<Prisma.ProductCountArgs> = z.object({ orderBy: z.union([ProductOrderByWithRelationInputObjectSchema, ProductOrderByWithRelationInputObjectSchema.array()]).optional(), where: ProductWhereInputObjectSchema.optional(), cursor: ProductWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), ProductCountAggregateInputObjectSchema ]).optional() }).strict() as unknown as z.ZodType<Prisma.ProductCountArgs>;

export const ProductCountZodSchema = z.object({ orderBy: z.union([ProductOrderByWithRelationInputObjectSchema, ProductOrderByWithRelationInputObjectSchema.array()]).optional(), where: ProductWhereInputObjectSchema.optional(), cursor: ProductWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), ProductCountAggregateInputObjectSchema ]).optional() }).strict();
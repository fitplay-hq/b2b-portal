import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { ProductOrderByWithRelationInputObjectSchema as ProductOrderByWithRelationInputObjectSchema } from './objects/ProductOrderByWithRelationInput.schema';
import { ProductWhereInputObjectSchema as ProductWhereInputObjectSchema } from './objects/ProductWhereInput.schema';
import { ProductWhereUniqueInputObjectSchema as ProductWhereUniqueInputObjectSchema } from './objects/ProductWhereUniqueInput.schema';
import { ProductCountAggregateInputObjectSchema as ProductCountAggregateInputObjectSchema } from './objects/ProductCountAggregateInput.schema';
import { ProductMinAggregateInputObjectSchema as ProductMinAggregateInputObjectSchema } from './objects/ProductMinAggregateInput.schema';
import { ProductMaxAggregateInputObjectSchema as ProductMaxAggregateInputObjectSchema } from './objects/ProductMaxAggregateInput.schema';
import { ProductAvgAggregateInputObjectSchema as ProductAvgAggregateInputObjectSchema } from './objects/ProductAvgAggregateInput.schema';
import { ProductSumAggregateInputObjectSchema as ProductSumAggregateInputObjectSchema } from './objects/ProductSumAggregateInput.schema';

export const ProductAggregateSchema: z.ZodType<Prisma.ProductAggregateArgs> = z.object({ orderBy: z.union([ProductOrderByWithRelationInputObjectSchema, ProductOrderByWithRelationInputObjectSchema.array()]).optional(), where: ProductWhereInputObjectSchema.optional(), cursor: ProductWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), _count: z.union([ z.literal(true), ProductCountAggregateInputObjectSchema ]).optional(), _min: ProductMinAggregateInputObjectSchema.optional(), _max: ProductMaxAggregateInputObjectSchema.optional(), _avg: ProductAvgAggregateInputObjectSchema.optional(), _sum: ProductSumAggregateInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.ProductAggregateArgs>;

export const ProductAggregateZodSchema = z.object({ orderBy: z.union([ProductOrderByWithRelationInputObjectSchema, ProductOrderByWithRelationInputObjectSchema.array()]).optional(), where: ProductWhereInputObjectSchema.optional(), cursor: ProductWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), _count: z.union([ z.literal(true), ProductCountAggregateInputObjectSchema ]).optional(), _min: ProductMinAggregateInputObjectSchema.optional(), _max: ProductMaxAggregateInputObjectSchema.optional(), _avg: ProductAvgAggregateInputObjectSchema.optional(), _sum: ProductSumAggregateInputObjectSchema.optional() }).strict();
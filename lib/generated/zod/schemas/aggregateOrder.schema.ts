import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { OrderOrderByWithRelationInputObjectSchema as OrderOrderByWithRelationInputObjectSchema } from './objects/OrderOrderByWithRelationInput.schema';
import { OrderWhereInputObjectSchema as OrderWhereInputObjectSchema } from './objects/OrderWhereInput.schema';
import { OrderWhereUniqueInputObjectSchema as OrderWhereUniqueInputObjectSchema } from './objects/OrderWhereUniqueInput.schema';
import { OrderCountAggregateInputObjectSchema as OrderCountAggregateInputObjectSchema } from './objects/OrderCountAggregateInput.schema';
import { OrderMinAggregateInputObjectSchema as OrderMinAggregateInputObjectSchema } from './objects/OrderMinAggregateInput.schema';
import { OrderMaxAggregateInputObjectSchema as OrderMaxAggregateInputObjectSchema } from './objects/OrderMaxAggregateInput.schema';
import { OrderAvgAggregateInputObjectSchema as OrderAvgAggregateInputObjectSchema } from './objects/OrderAvgAggregateInput.schema';
import { OrderSumAggregateInputObjectSchema as OrderSumAggregateInputObjectSchema } from './objects/OrderSumAggregateInput.schema';

export const OrderAggregateSchema: z.ZodType<Prisma.OrderAggregateArgs> = z.object({ orderBy: z.union([OrderOrderByWithRelationInputObjectSchema, OrderOrderByWithRelationInputObjectSchema.array()]).optional(), where: OrderWhereInputObjectSchema.optional(), cursor: OrderWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), _count: z.union([ z.literal(true), OrderCountAggregateInputObjectSchema ]).optional(), _min: OrderMinAggregateInputObjectSchema.optional(), _max: OrderMaxAggregateInputObjectSchema.optional(), _avg: OrderAvgAggregateInputObjectSchema.optional(), _sum: OrderSumAggregateInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.OrderAggregateArgs>;

export const OrderAggregateZodSchema = z.object({ orderBy: z.union([OrderOrderByWithRelationInputObjectSchema, OrderOrderByWithRelationInputObjectSchema.array()]).optional(), where: OrderWhereInputObjectSchema.optional(), cursor: OrderWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), _count: z.union([ z.literal(true), OrderCountAggregateInputObjectSchema ]).optional(), _min: OrderMinAggregateInputObjectSchema.optional(), _max: OrderMaxAggregateInputObjectSchema.optional(), _avg: OrderAvgAggregateInputObjectSchema.optional(), _sum: OrderSumAggregateInputObjectSchema.optional() }).strict();
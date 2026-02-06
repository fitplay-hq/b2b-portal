import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { OrderWhereInputObjectSchema as OrderWhereInputObjectSchema } from './objects/OrderWhereInput.schema';
import { OrderOrderByWithAggregationInputObjectSchema as OrderOrderByWithAggregationInputObjectSchema } from './objects/OrderOrderByWithAggregationInput.schema';
import { OrderScalarWhereWithAggregatesInputObjectSchema as OrderScalarWhereWithAggregatesInputObjectSchema } from './objects/OrderScalarWhereWithAggregatesInput.schema';
import { OrderScalarFieldEnumSchema } from './enums/OrderScalarFieldEnum.schema';
import { OrderCountAggregateInputObjectSchema as OrderCountAggregateInputObjectSchema } from './objects/OrderCountAggregateInput.schema';
import { OrderMinAggregateInputObjectSchema as OrderMinAggregateInputObjectSchema } from './objects/OrderMinAggregateInput.schema';
import { OrderMaxAggregateInputObjectSchema as OrderMaxAggregateInputObjectSchema } from './objects/OrderMaxAggregateInput.schema';
import { OrderAvgAggregateInputObjectSchema as OrderAvgAggregateInputObjectSchema } from './objects/OrderAvgAggregateInput.schema';
import { OrderSumAggregateInputObjectSchema as OrderSumAggregateInputObjectSchema } from './objects/OrderSumAggregateInput.schema';

export const OrderGroupBySchema: z.ZodType<Prisma.OrderGroupByArgs> = z.object({ where: OrderWhereInputObjectSchema.optional(), orderBy: z.union([OrderOrderByWithAggregationInputObjectSchema, OrderOrderByWithAggregationInputObjectSchema.array()]).optional(), having: OrderScalarWhereWithAggregatesInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), by: z.array(OrderScalarFieldEnumSchema), _count: z.union([ z.literal(true), OrderCountAggregateInputObjectSchema ]).optional(), _min: OrderMinAggregateInputObjectSchema.optional(), _max: OrderMaxAggregateInputObjectSchema.optional(), _avg: OrderAvgAggregateInputObjectSchema.optional(), _sum: OrderSumAggregateInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.OrderGroupByArgs>;

export const OrderGroupByZodSchema = z.object({ where: OrderWhereInputObjectSchema.optional(), orderBy: z.union([OrderOrderByWithAggregationInputObjectSchema, OrderOrderByWithAggregationInputObjectSchema.array()]).optional(), having: OrderScalarWhereWithAggregatesInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), by: z.array(OrderScalarFieldEnumSchema), _count: z.union([ z.literal(true), OrderCountAggregateInputObjectSchema ]).optional(), _min: OrderMinAggregateInputObjectSchema.optional(), _max: OrderMaxAggregateInputObjectSchema.optional(), _avg: OrderAvgAggregateInputObjectSchema.optional(), _sum: OrderSumAggregateInputObjectSchema.optional() }).strict();
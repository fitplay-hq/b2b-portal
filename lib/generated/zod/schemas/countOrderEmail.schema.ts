import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { OrderEmailOrderByWithRelationInputObjectSchema as OrderEmailOrderByWithRelationInputObjectSchema } from './objects/OrderEmailOrderByWithRelationInput.schema';
import { OrderEmailWhereInputObjectSchema as OrderEmailWhereInputObjectSchema } from './objects/OrderEmailWhereInput.schema';
import { OrderEmailWhereUniqueInputObjectSchema as OrderEmailWhereUniqueInputObjectSchema } from './objects/OrderEmailWhereUniqueInput.schema';
import { OrderEmailCountAggregateInputObjectSchema as OrderEmailCountAggregateInputObjectSchema } from './objects/OrderEmailCountAggregateInput.schema';

export const OrderEmailCountSchema: z.ZodType<Prisma.OrderEmailCountArgs> = z.object({ orderBy: z.union([OrderEmailOrderByWithRelationInputObjectSchema, OrderEmailOrderByWithRelationInputObjectSchema.array()]).optional(), where: OrderEmailWhereInputObjectSchema.optional(), cursor: OrderEmailWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), OrderEmailCountAggregateInputObjectSchema ]).optional() }).strict() as unknown as z.ZodType<Prisma.OrderEmailCountArgs>;

export const OrderEmailCountZodSchema = z.object({ orderBy: z.union([OrderEmailOrderByWithRelationInputObjectSchema, OrderEmailOrderByWithRelationInputObjectSchema.array()]).optional(), where: OrderEmailWhereInputObjectSchema.optional(), cursor: OrderEmailWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), OrderEmailCountAggregateInputObjectSchema ]).optional() }).strict();
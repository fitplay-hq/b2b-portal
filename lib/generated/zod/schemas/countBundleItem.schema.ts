import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { BundleItemOrderByWithRelationInputObjectSchema as BundleItemOrderByWithRelationInputObjectSchema } from './objects/BundleItemOrderByWithRelationInput.schema';
import { BundleItemWhereInputObjectSchema as BundleItemWhereInputObjectSchema } from './objects/BundleItemWhereInput.schema';
import { BundleItemWhereUniqueInputObjectSchema as BundleItemWhereUniqueInputObjectSchema } from './objects/BundleItemWhereUniqueInput.schema';
import { BundleItemCountAggregateInputObjectSchema as BundleItemCountAggregateInputObjectSchema } from './objects/BundleItemCountAggregateInput.schema';

export const BundleItemCountSchema: z.ZodType<Prisma.BundleItemCountArgs> = z.object({ orderBy: z.union([BundleItemOrderByWithRelationInputObjectSchema, BundleItemOrderByWithRelationInputObjectSchema.array()]).optional(), where: BundleItemWhereInputObjectSchema.optional(), cursor: BundleItemWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), BundleItemCountAggregateInputObjectSchema ]).optional() }).strict() as unknown as z.ZodType<Prisma.BundleItemCountArgs>;

export const BundleItemCountZodSchema = z.object({ orderBy: z.union([BundleItemOrderByWithRelationInputObjectSchema, BundleItemOrderByWithRelationInputObjectSchema.array()]).optional(), where: BundleItemWhereInputObjectSchema.optional(), cursor: BundleItemWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), BundleItemCountAggregateInputObjectSchema ]).optional() }).strict();
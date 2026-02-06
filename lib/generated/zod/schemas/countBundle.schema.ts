import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { BundleOrderByWithRelationInputObjectSchema as BundleOrderByWithRelationInputObjectSchema } from './objects/BundleOrderByWithRelationInput.schema';
import { BundleWhereInputObjectSchema as BundleWhereInputObjectSchema } from './objects/BundleWhereInput.schema';
import { BundleWhereUniqueInputObjectSchema as BundleWhereUniqueInputObjectSchema } from './objects/BundleWhereUniqueInput.schema';
import { BundleCountAggregateInputObjectSchema as BundleCountAggregateInputObjectSchema } from './objects/BundleCountAggregateInput.schema';

export const BundleCountSchema: z.ZodType<Prisma.BundleCountArgs> = z.object({ orderBy: z.union([BundleOrderByWithRelationInputObjectSchema, BundleOrderByWithRelationInputObjectSchema.array()]).optional(), where: BundleWhereInputObjectSchema.optional(), cursor: BundleWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), BundleCountAggregateInputObjectSchema ]).optional() }).strict() as unknown as z.ZodType<Prisma.BundleCountArgs>;

export const BundleCountZodSchema = z.object({ orderBy: z.union([BundleOrderByWithRelationInputObjectSchema, BundleOrderByWithRelationInputObjectSchema.array()]).optional(), where: BundleWhereInputObjectSchema.optional(), cursor: BundleWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), BundleCountAggregateInputObjectSchema ]).optional() }).strict();
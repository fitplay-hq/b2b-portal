import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { ResetTokenOrderByWithRelationInputObjectSchema as ResetTokenOrderByWithRelationInputObjectSchema } from './objects/ResetTokenOrderByWithRelationInput.schema';
import { ResetTokenWhereInputObjectSchema as ResetTokenWhereInputObjectSchema } from './objects/ResetTokenWhereInput.schema';
import { ResetTokenWhereUniqueInputObjectSchema as ResetTokenWhereUniqueInputObjectSchema } from './objects/ResetTokenWhereUniqueInput.schema';
import { ResetTokenCountAggregateInputObjectSchema as ResetTokenCountAggregateInputObjectSchema } from './objects/ResetTokenCountAggregateInput.schema';

export const ResetTokenCountSchema: z.ZodType<Prisma.ResetTokenCountArgs> = z.object({ orderBy: z.union([ResetTokenOrderByWithRelationInputObjectSchema, ResetTokenOrderByWithRelationInputObjectSchema.array()]).optional(), where: ResetTokenWhereInputObjectSchema.optional(), cursor: ResetTokenWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), ResetTokenCountAggregateInputObjectSchema ]).optional() }).strict() as unknown as z.ZodType<Prisma.ResetTokenCountArgs>;

export const ResetTokenCountZodSchema = z.object({ orderBy: z.union([ResetTokenOrderByWithRelationInputObjectSchema, ResetTokenOrderByWithRelationInputObjectSchema.array()]).optional(), where: ResetTokenWhereInputObjectSchema.optional(), cursor: ResetTokenWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), ResetTokenCountAggregateInputObjectSchema ]).optional() }).strict();
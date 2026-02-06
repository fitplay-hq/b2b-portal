import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { SystemUserOrderByWithRelationInputObjectSchema as SystemUserOrderByWithRelationInputObjectSchema } from './objects/SystemUserOrderByWithRelationInput.schema';
import { SystemUserWhereInputObjectSchema as SystemUserWhereInputObjectSchema } from './objects/SystemUserWhereInput.schema';
import { SystemUserWhereUniqueInputObjectSchema as SystemUserWhereUniqueInputObjectSchema } from './objects/SystemUserWhereUniqueInput.schema';
import { SystemUserCountAggregateInputObjectSchema as SystemUserCountAggregateInputObjectSchema } from './objects/SystemUserCountAggregateInput.schema';

export const SystemUserCountSchema: z.ZodType<Prisma.SystemUserCountArgs> = z.object({ orderBy: z.union([SystemUserOrderByWithRelationInputObjectSchema, SystemUserOrderByWithRelationInputObjectSchema.array()]).optional(), where: SystemUserWhereInputObjectSchema.optional(), cursor: SystemUserWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), SystemUserCountAggregateInputObjectSchema ]).optional() }).strict() as unknown as z.ZodType<Prisma.SystemUserCountArgs>;

export const SystemUserCountZodSchema = z.object({ orderBy: z.union([SystemUserOrderByWithRelationInputObjectSchema, SystemUserOrderByWithRelationInputObjectSchema.array()]).optional(), where: SystemUserWhereInputObjectSchema.optional(), cursor: SystemUserWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), SystemUserCountAggregateInputObjectSchema ]).optional() }).strict();
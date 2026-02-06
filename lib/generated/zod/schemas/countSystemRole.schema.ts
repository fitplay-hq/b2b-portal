import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { SystemRoleOrderByWithRelationInputObjectSchema as SystemRoleOrderByWithRelationInputObjectSchema } from './objects/SystemRoleOrderByWithRelationInput.schema';
import { SystemRoleWhereInputObjectSchema as SystemRoleWhereInputObjectSchema } from './objects/SystemRoleWhereInput.schema';
import { SystemRoleWhereUniqueInputObjectSchema as SystemRoleWhereUniqueInputObjectSchema } from './objects/SystemRoleWhereUniqueInput.schema';
import { SystemRoleCountAggregateInputObjectSchema as SystemRoleCountAggregateInputObjectSchema } from './objects/SystemRoleCountAggregateInput.schema';

export const SystemRoleCountSchema: z.ZodType<Prisma.SystemRoleCountArgs> = z.object({ orderBy: z.union([SystemRoleOrderByWithRelationInputObjectSchema, SystemRoleOrderByWithRelationInputObjectSchema.array()]).optional(), where: SystemRoleWhereInputObjectSchema.optional(), cursor: SystemRoleWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), SystemRoleCountAggregateInputObjectSchema ]).optional() }).strict() as unknown as z.ZodType<Prisma.SystemRoleCountArgs>;

export const SystemRoleCountZodSchema = z.object({ orderBy: z.union([SystemRoleOrderByWithRelationInputObjectSchema, SystemRoleOrderByWithRelationInputObjectSchema.array()]).optional(), where: SystemRoleWhereInputObjectSchema.optional(), cursor: SystemRoleWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), SystemRoleCountAggregateInputObjectSchema ]).optional() }).strict();
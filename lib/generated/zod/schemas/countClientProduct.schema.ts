import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { ClientProductOrderByWithRelationInputObjectSchema as ClientProductOrderByWithRelationInputObjectSchema } from './objects/ClientProductOrderByWithRelationInput.schema';
import { ClientProductWhereInputObjectSchema as ClientProductWhereInputObjectSchema } from './objects/ClientProductWhereInput.schema';
import { ClientProductWhereUniqueInputObjectSchema as ClientProductWhereUniqueInputObjectSchema } from './objects/ClientProductWhereUniqueInput.schema';
import { ClientProductCountAggregateInputObjectSchema as ClientProductCountAggregateInputObjectSchema } from './objects/ClientProductCountAggregateInput.schema';

export const ClientProductCountSchema: z.ZodType<Prisma.ClientProductCountArgs> = z.object({ orderBy: z.union([ClientProductOrderByWithRelationInputObjectSchema, ClientProductOrderByWithRelationInputObjectSchema.array()]).optional(), where: ClientProductWhereInputObjectSchema.optional(), cursor: ClientProductWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), ClientProductCountAggregateInputObjectSchema ]).optional() }).strict() as unknown as z.ZodType<Prisma.ClientProductCountArgs>;

export const ClientProductCountZodSchema = z.object({ orderBy: z.union([ClientProductOrderByWithRelationInputObjectSchema, ClientProductOrderByWithRelationInputObjectSchema.array()]).optional(), where: ClientProductWhereInputObjectSchema.optional(), cursor: ClientProductWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), ClientProductCountAggregateInputObjectSchema ]).optional() }).strict();
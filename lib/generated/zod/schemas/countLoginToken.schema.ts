import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { LoginTokenOrderByWithRelationInputObjectSchema as LoginTokenOrderByWithRelationInputObjectSchema } from './objects/LoginTokenOrderByWithRelationInput.schema';
import { LoginTokenWhereInputObjectSchema as LoginTokenWhereInputObjectSchema } from './objects/LoginTokenWhereInput.schema';
import { LoginTokenWhereUniqueInputObjectSchema as LoginTokenWhereUniqueInputObjectSchema } from './objects/LoginTokenWhereUniqueInput.schema';
import { LoginTokenCountAggregateInputObjectSchema as LoginTokenCountAggregateInputObjectSchema } from './objects/LoginTokenCountAggregateInput.schema';

export const LoginTokenCountSchema: z.ZodType<Prisma.LoginTokenCountArgs> = z.object({ orderBy: z.union([LoginTokenOrderByWithRelationInputObjectSchema, LoginTokenOrderByWithRelationInputObjectSchema.array()]).optional(), where: LoginTokenWhereInputObjectSchema.optional(), cursor: LoginTokenWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), LoginTokenCountAggregateInputObjectSchema ]).optional() }).strict() as unknown as z.ZodType<Prisma.LoginTokenCountArgs>;

export const LoginTokenCountZodSchema = z.object({ orderBy: z.union([LoginTokenOrderByWithRelationInputObjectSchema, LoginTokenOrderByWithRelationInputObjectSchema.array()]).optional(), where: LoginTokenWhereInputObjectSchema.optional(), cursor: LoginTokenWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), LoginTokenCountAggregateInputObjectSchema ]).optional() }).strict();
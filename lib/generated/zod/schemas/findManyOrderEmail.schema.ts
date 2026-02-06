import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { OrderEmailIncludeObjectSchema as OrderEmailIncludeObjectSchema } from './objects/OrderEmailInclude.schema';
import { OrderEmailOrderByWithRelationInputObjectSchema as OrderEmailOrderByWithRelationInputObjectSchema } from './objects/OrderEmailOrderByWithRelationInput.schema';
import { OrderEmailWhereInputObjectSchema as OrderEmailWhereInputObjectSchema } from './objects/OrderEmailWhereInput.schema';
import { OrderEmailWhereUniqueInputObjectSchema as OrderEmailWhereUniqueInputObjectSchema } from './objects/OrderEmailWhereUniqueInput.schema';
import { OrderEmailScalarFieldEnumSchema } from './enums/OrderEmailScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const OrderEmailFindManySelectSchema: z.ZodType<Prisma.OrderEmailSelect> = z.object({
    id: z.boolean().optional(),
    order: z.boolean().optional(),
    orderId: z.boolean().optional(),
    purpose: z.boolean().optional(),
    isSent: z.boolean().optional(),
    sentAt: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.OrderEmailSelect>;

export const OrderEmailFindManySelectZodSchema = z.object({
    id: z.boolean().optional(),
    order: z.boolean().optional(),
    orderId: z.boolean().optional(),
    purpose: z.boolean().optional(),
    isSent: z.boolean().optional(),
    sentAt: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional()
  }).strict();

export const OrderEmailFindManySchema: z.ZodType<Prisma.OrderEmailFindManyArgs> = z.object({ select: OrderEmailFindManySelectSchema.optional(), include: z.lazy(() => OrderEmailIncludeObjectSchema.optional()), orderBy: z.union([OrderEmailOrderByWithRelationInputObjectSchema, OrderEmailOrderByWithRelationInputObjectSchema.array()]).optional(), where: OrderEmailWhereInputObjectSchema.optional(), cursor: OrderEmailWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([OrderEmailScalarFieldEnumSchema, OrderEmailScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.OrderEmailFindManyArgs>;

export const OrderEmailFindManyZodSchema = z.object({ select: OrderEmailFindManySelectSchema.optional(), include: z.lazy(() => OrderEmailIncludeObjectSchema.optional()), orderBy: z.union([OrderEmailOrderByWithRelationInputObjectSchema, OrderEmailOrderByWithRelationInputObjectSchema.array()]).optional(), where: OrderEmailWhereInputObjectSchema.optional(), cursor: OrderEmailWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([OrderEmailScalarFieldEnumSchema, OrderEmailScalarFieldEnumSchema.array()]).optional() }).strict();
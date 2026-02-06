import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { OrderEmailIncludeObjectSchema as OrderEmailIncludeObjectSchema } from './objects/OrderEmailInclude.schema';
import { OrderEmailOrderByWithRelationInputObjectSchema as OrderEmailOrderByWithRelationInputObjectSchema } from './objects/OrderEmailOrderByWithRelationInput.schema';
import { OrderEmailWhereInputObjectSchema as OrderEmailWhereInputObjectSchema } from './objects/OrderEmailWhereInput.schema';
import { OrderEmailWhereUniqueInputObjectSchema as OrderEmailWhereUniqueInputObjectSchema } from './objects/OrderEmailWhereUniqueInput.schema';
import { OrderEmailScalarFieldEnumSchema } from './enums/OrderEmailScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const OrderEmailFindFirstOrThrowSelectSchema: z.ZodType<Prisma.OrderEmailSelect> = z.object({
    id: z.boolean().optional(),
    order: z.boolean().optional(),
    orderId: z.boolean().optional(),
    purpose: z.boolean().optional(),
    isSent: z.boolean().optional(),
    sentAt: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.OrderEmailSelect>;

export const OrderEmailFindFirstOrThrowSelectZodSchema = z.object({
    id: z.boolean().optional(),
    order: z.boolean().optional(),
    orderId: z.boolean().optional(),
    purpose: z.boolean().optional(),
    isSent: z.boolean().optional(),
    sentAt: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional()
  }).strict();

export const OrderEmailFindFirstOrThrowSchema: z.ZodType<Prisma.OrderEmailFindFirstOrThrowArgs> = z.object({ select: OrderEmailFindFirstOrThrowSelectSchema.optional(), include: z.lazy(() => OrderEmailIncludeObjectSchema.optional()), orderBy: z.union([OrderEmailOrderByWithRelationInputObjectSchema, OrderEmailOrderByWithRelationInputObjectSchema.array()]).optional(), where: OrderEmailWhereInputObjectSchema.optional(), cursor: OrderEmailWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([OrderEmailScalarFieldEnumSchema, OrderEmailScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.OrderEmailFindFirstOrThrowArgs>;

export const OrderEmailFindFirstOrThrowZodSchema = z.object({ select: OrderEmailFindFirstOrThrowSelectSchema.optional(), include: z.lazy(() => OrderEmailIncludeObjectSchema.optional()), orderBy: z.union([OrderEmailOrderByWithRelationInputObjectSchema, OrderEmailOrderByWithRelationInputObjectSchema.array()]).optional(), where: OrderEmailWhereInputObjectSchema.optional(), cursor: OrderEmailWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([OrderEmailScalarFieldEnumSchema, OrderEmailScalarFieldEnumSchema.array()]).optional() }).strict();
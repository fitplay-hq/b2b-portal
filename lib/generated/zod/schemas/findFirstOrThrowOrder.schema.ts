import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { OrderIncludeObjectSchema as OrderIncludeObjectSchema } from './objects/OrderInclude.schema';
import { OrderOrderByWithRelationInputObjectSchema as OrderOrderByWithRelationInputObjectSchema } from './objects/OrderOrderByWithRelationInput.schema';
import { OrderWhereInputObjectSchema as OrderWhereInputObjectSchema } from './objects/OrderWhereInput.schema';
import { OrderWhereUniqueInputObjectSchema as OrderWhereUniqueInputObjectSchema } from './objects/OrderWhereUniqueInput.schema';
import { OrderScalarFieldEnumSchema } from './enums/OrderScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const OrderFindFirstOrThrowSelectSchema: z.ZodType<Prisma.OrderSelect> = z.object({
    id: z.boolean().optional(),
    totalAmount: z.boolean().optional(),
    consigneeName: z.boolean().optional(),
    consigneePhone: z.boolean().optional(),
    consigneeEmail: z.boolean().optional(),
    consignmentNumber: z.boolean().optional(),
    deliveryService: z.boolean().optional(),
    deliveryAddress: z.boolean().optional(),
    city: z.boolean().optional(),
    state: z.boolean().optional(),
    pincode: z.boolean().optional(),
    modeOfDelivery: z.boolean().optional(),
    requiredByDate: z.boolean().optional(),
    deliveryReference: z.boolean().optional(),
    packagingInstructions: z.boolean().optional(),
    note: z.boolean().optional(),
    shippingLabelUrl: z.boolean().optional(),
    isMailSent: z.boolean().optional(),
    status: z.boolean().optional(),
    client: z.boolean().optional(),
    clientId: z.boolean().optional(),
    orderItems: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    emails: z.boolean().optional(),
    bundleOrderItems: z.boolean().optional(),
    bundles: z.boolean().optional(),
    numberOfBundles: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.OrderSelect>;

export const OrderFindFirstOrThrowSelectZodSchema = z.object({
    id: z.boolean().optional(),
    totalAmount: z.boolean().optional(),
    consigneeName: z.boolean().optional(),
    consigneePhone: z.boolean().optional(),
    consigneeEmail: z.boolean().optional(),
    consignmentNumber: z.boolean().optional(),
    deliveryService: z.boolean().optional(),
    deliveryAddress: z.boolean().optional(),
    city: z.boolean().optional(),
    state: z.boolean().optional(),
    pincode: z.boolean().optional(),
    modeOfDelivery: z.boolean().optional(),
    requiredByDate: z.boolean().optional(),
    deliveryReference: z.boolean().optional(),
    packagingInstructions: z.boolean().optional(),
    note: z.boolean().optional(),
    shippingLabelUrl: z.boolean().optional(),
    isMailSent: z.boolean().optional(),
    status: z.boolean().optional(),
    client: z.boolean().optional(),
    clientId: z.boolean().optional(),
    orderItems: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    emails: z.boolean().optional(),
    bundleOrderItems: z.boolean().optional(),
    bundles: z.boolean().optional(),
    numberOfBundles: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict();

export const OrderFindFirstOrThrowSchema: z.ZodType<Prisma.OrderFindFirstOrThrowArgs> = z.object({ select: OrderFindFirstOrThrowSelectSchema.optional(), include: z.lazy(() => OrderIncludeObjectSchema.optional()), orderBy: z.union([OrderOrderByWithRelationInputObjectSchema, OrderOrderByWithRelationInputObjectSchema.array()]).optional(), where: OrderWhereInputObjectSchema.optional(), cursor: OrderWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([OrderScalarFieldEnumSchema, OrderScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.OrderFindFirstOrThrowArgs>;

export const OrderFindFirstOrThrowZodSchema = z.object({ select: OrderFindFirstOrThrowSelectSchema.optional(), include: z.lazy(() => OrderIncludeObjectSchema.optional()), orderBy: z.union([OrderOrderByWithRelationInputObjectSchema, OrderOrderByWithRelationInputObjectSchema.array()]).optional(), where: OrderWhereInputObjectSchema.optional(), cursor: OrderWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([OrderScalarFieldEnumSchema, OrderScalarFieldEnumSchema.array()]).optional() }).strict();
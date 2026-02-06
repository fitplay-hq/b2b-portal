import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { ClientIncludeObjectSchema as ClientIncludeObjectSchema } from './objects/ClientInclude.schema';
import { ClientOrderByWithRelationInputObjectSchema as ClientOrderByWithRelationInputObjectSchema } from './objects/ClientOrderByWithRelationInput.schema';
import { ClientWhereInputObjectSchema as ClientWhereInputObjectSchema } from './objects/ClientWhereInput.schema';
import { ClientWhereUniqueInputObjectSchema as ClientWhereUniqueInputObjectSchema } from './objects/ClientWhereUniqueInput.schema';
import { ClientScalarFieldEnumSchema } from './enums/ClientScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const ClientFindFirstSelectSchema: z.ZodType<Prisma.ClientSelect> = z.object({
    id: z.boolean().optional(),
    name: z.boolean().optional(),
    email: z.boolean().optional(),
    password: z.boolean().optional(),
    phone: z.boolean().optional(),
    company: z.boolean().optional(),
    companyID: z.boolean().optional(),
    companyName: z.boolean().optional(),
    isShowPrice: z.boolean().optional(),
    address: z.boolean().optional(),
    role: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    orders: z.boolean().optional(),
    products: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.ClientSelect>;

export const ClientFindFirstSelectZodSchema = z.object({
    id: z.boolean().optional(),
    name: z.boolean().optional(),
    email: z.boolean().optional(),
    password: z.boolean().optional(),
    phone: z.boolean().optional(),
    company: z.boolean().optional(),
    companyID: z.boolean().optional(),
    companyName: z.boolean().optional(),
    isShowPrice: z.boolean().optional(),
    address: z.boolean().optional(),
    role: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    orders: z.boolean().optional(),
    products: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict();

export const ClientFindFirstSchema: z.ZodType<Prisma.ClientFindFirstArgs> = z.object({ select: ClientFindFirstSelectSchema.optional(), include: z.lazy(() => ClientIncludeObjectSchema.optional()), orderBy: z.union([ClientOrderByWithRelationInputObjectSchema, ClientOrderByWithRelationInputObjectSchema.array()]).optional(), where: ClientWhereInputObjectSchema.optional(), cursor: ClientWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([ClientScalarFieldEnumSchema, ClientScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.ClientFindFirstArgs>;

export const ClientFindFirstZodSchema = z.object({ select: ClientFindFirstSelectSchema.optional(), include: z.lazy(() => ClientIncludeObjectSchema.optional()), orderBy: z.union([ClientOrderByWithRelationInputObjectSchema, ClientOrderByWithRelationInputObjectSchema.array()]).optional(), where: ClientWhereInputObjectSchema.optional(), cursor: ClientWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([ClientScalarFieldEnumSchema, ClientScalarFieldEnumSchema.array()]).optional() }).strict();
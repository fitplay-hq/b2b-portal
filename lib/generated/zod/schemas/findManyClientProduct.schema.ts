import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { ClientProductIncludeObjectSchema as ClientProductIncludeObjectSchema } from './objects/ClientProductInclude.schema';
import { ClientProductOrderByWithRelationInputObjectSchema as ClientProductOrderByWithRelationInputObjectSchema } from './objects/ClientProductOrderByWithRelationInput.schema';
import { ClientProductWhereInputObjectSchema as ClientProductWhereInputObjectSchema } from './objects/ClientProductWhereInput.schema';
import { ClientProductWhereUniqueInputObjectSchema as ClientProductWhereUniqueInputObjectSchema } from './objects/ClientProductWhereUniqueInput.schema';
import { ClientProductScalarFieldEnumSchema } from './enums/ClientProductScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const ClientProductFindManySelectSchema: z.ZodType<Prisma.ClientProductSelect> = z.object({
    id: z.boolean().optional(),
    client: z.boolean().optional(),
    clientId: z.boolean().optional(),
    product: z.boolean().optional(),
    productId: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.ClientProductSelect>;

export const ClientProductFindManySelectZodSchema = z.object({
    id: z.boolean().optional(),
    client: z.boolean().optional(),
    clientId: z.boolean().optional(),
    product: z.boolean().optional(),
    productId: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional()
  }).strict();

export const ClientProductFindManySchema: z.ZodType<Prisma.ClientProductFindManyArgs> = z.object({ select: ClientProductFindManySelectSchema.optional(), include: z.lazy(() => ClientProductIncludeObjectSchema.optional()), orderBy: z.union([ClientProductOrderByWithRelationInputObjectSchema, ClientProductOrderByWithRelationInputObjectSchema.array()]).optional(), where: ClientProductWhereInputObjectSchema.optional(), cursor: ClientProductWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([ClientProductScalarFieldEnumSchema, ClientProductScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.ClientProductFindManyArgs>;

export const ClientProductFindManyZodSchema = z.object({ select: ClientProductFindManySelectSchema.optional(), include: z.lazy(() => ClientProductIncludeObjectSchema.optional()), orderBy: z.union([ClientProductOrderByWithRelationInputObjectSchema, ClientProductOrderByWithRelationInputObjectSchema.array()]).optional(), where: ClientProductWhereInputObjectSchema.optional(), cursor: ClientProductWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([ClientProductScalarFieldEnumSchema, ClientProductScalarFieldEnumSchema.array()]).optional() }).strict();
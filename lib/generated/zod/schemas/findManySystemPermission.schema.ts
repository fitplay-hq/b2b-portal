import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { SystemPermissionIncludeObjectSchema as SystemPermissionIncludeObjectSchema } from './objects/SystemPermissionInclude.schema';
import { SystemPermissionOrderByWithRelationInputObjectSchema as SystemPermissionOrderByWithRelationInputObjectSchema } from './objects/SystemPermissionOrderByWithRelationInput.schema';
import { SystemPermissionWhereInputObjectSchema as SystemPermissionWhereInputObjectSchema } from './objects/SystemPermissionWhereInput.schema';
import { SystemPermissionWhereUniqueInputObjectSchema as SystemPermissionWhereUniqueInputObjectSchema } from './objects/SystemPermissionWhereUniqueInput.schema';
import { SystemPermissionScalarFieldEnumSchema } from './enums/SystemPermissionScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const SystemPermissionFindManySelectSchema: z.ZodType<Prisma.SystemPermissionSelect> = z.object({
    id: z.boolean().optional(),
    resource: z.boolean().optional(),
    action: z.boolean().optional(),
    description: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    roles: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.SystemPermissionSelect>;

export const SystemPermissionFindManySelectZodSchema = z.object({
    id: z.boolean().optional(),
    resource: z.boolean().optional(),
    action: z.boolean().optional(),
    description: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    roles: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict();

export const SystemPermissionFindManySchema: z.ZodType<Prisma.SystemPermissionFindManyArgs> = z.object({ select: SystemPermissionFindManySelectSchema.optional(), include: z.lazy(() => SystemPermissionIncludeObjectSchema.optional()), orderBy: z.union([SystemPermissionOrderByWithRelationInputObjectSchema, SystemPermissionOrderByWithRelationInputObjectSchema.array()]).optional(), where: SystemPermissionWhereInputObjectSchema.optional(), cursor: SystemPermissionWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([SystemPermissionScalarFieldEnumSchema, SystemPermissionScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.SystemPermissionFindManyArgs>;

export const SystemPermissionFindManyZodSchema = z.object({ select: SystemPermissionFindManySelectSchema.optional(), include: z.lazy(() => SystemPermissionIncludeObjectSchema.optional()), orderBy: z.union([SystemPermissionOrderByWithRelationInputObjectSchema, SystemPermissionOrderByWithRelationInputObjectSchema.array()]).optional(), where: SystemPermissionWhereInputObjectSchema.optional(), cursor: SystemPermissionWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([SystemPermissionScalarFieldEnumSchema, SystemPermissionScalarFieldEnumSchema.array()]).optional() }).strict();
import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { SystemRoleIncludeObjectSchema as SystemRoleIncludeObjectSchema } from './objects/SystemRoleInclude.schema';
import { SystemRoleOrderByWithRelationInputObjectSchema as SystemRoleOrderByWithRelationInputObjectSchema } from './objects/SystemRoleOrderByWithRelationInput.schema';
import { SystemRoleWhereInputObjectSchema as SystemRoleWhereInputObjectSchema } from './objects/SystemRoleWhereInput.schema';
import { SystemRoleWhereUniqueInputObjectSchema as SystemRoleWhereUniqueInputObjectSchema } from './objects/SystemRoleWhereUniqueInput.schema';
import { SystemRoleScalarFieldEnumSchema } from './enums/SystemRoleScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const SystemRoleFindFirstSelectSchema: z.ZodType<Prisma.SystemRoleSelect> = z.object({
    id: z.boolean().optional(),
    name: z.boolean().optional(),
    description: z.boolean().optional(),
    isActive: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    permissions: z.boolean().optional(),
    users: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.SystemRoleSelect>;

export const SystemRoleFindFirstSelectZodSchema = z.object({
    id: z.boolean().optional(),
    name: z.boolean().optional(),
    description: z.boolean().optional(),
    isActive: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    permissions: z.boolean().optional(),
    users: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict();

export const SystemRoleFindFirstSchema: z.ZodType<Prisma.SystemRoleFindFirstArgs> = z.object({ select: SystemRoleFindFirstSelectSchema.optional(), include: z.lazy(() => SystemRoleIncludeObjectSchema.optional()), orderBy: z.union([SystemRoleOrderByWithRelationInputObjectSchema, SystemRoleOrderByWithRelationInputObjectSchema.array()]).optional(), where: SystemRoleWhereInputObjectSchema.optional(), cursor: SystemRoleWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([SystemRoleScalarFieldEnumSchema, SystemRoleScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.SystemRoleFindFirstArgs>;

export const SystemRoleFindFirstZodSchema = z.object({ select: SystemRoleFindFirstSelectSchema.optional(), include: z.lazy(() => SystemRoleIncludeObjectSchema.optional()), orderBy: z.union([SystemRoleOrderByWithRelationInputObjectSchema, SystemRoleOrderByWithRelationInputObjectSchema.array()]).optional(), where: SystemRoleWhereInputObjectSchema.optional(), cursor: SystemRoleWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([SystemRoleScalarFieldEnumSchema, SystemRoleScalarFieldEnumSchema.array()]).optional() }).strict();
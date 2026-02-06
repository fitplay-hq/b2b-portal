import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { SystemUserIncludeObjectSchema as SystemUserIncludeObjectSchema } from './objects/SystemUserInclude.schema';
import { SystemUserOrderByWithRelationInputObjectSchema as SystemUserOrderByWithRelationInputObjectSchema } from './objects/SystemUserOrderByWithRelationInput.schema';
import { SystemUserWhereInputObjectSchema as SystemUserWhereInputObjectSchema } from './objects/SystemUserWhereInput.schema';
import { SystemUserWhereUniqueInputObjectSchema as SystemUserWhereUniqueInputObjectSchema } from './objects/SystemUserWhereUniqueInput.schema';
import { SystemUserScalarFieldEnumSchema } from './enums/SystemUserScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const SystemUserFindFirstOrThrowSelectSchema: z.ZodType<Prisma.SystemUserSelect> = z.object({
    id: z.boolean().optional(),
    name: z.boolean().optional(),
    email: z.boolean().optional(),
    password: z.boolean().optional(),
    isActive: z.boolean().optional(),
    role: z.boolean().optional(),
    roleId: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.SystemUserSelect>;

export const SystemUserFindFirstOrThrowSelectZodSchema = z.object({
    id: z.boolean().optional(),
    name: z.boolean().optional(),
    email: z.boolean().optional(),
    password: z.boolean().optional(),
    isActive: z.boolean().optional(),
    role: z.boolean().optional(),
    roleId: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional()
  }).strict();

export const SystemUserFindFirstOrThrowSchema: z.ZodType<Prisma.SystemUserFindFirstOrThrowArgs> = z.object({ select: SystemUserFindFirstOrThrowSelectSchema.optional(), include: z.lazy(() => SystemUserIncludeObjectSchema.optional()), orderBy: z.union([SystemUserOrderByWithRelationInputObjectSchema, SystemUserOrderByWithRelationInputObjectSchema.array()]).optional(), where: SystemUserWhereInputObjectSchema.optional(), cursor: SystemUserWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([SystemUserScalarFieldEnumSchema, SystemUserScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.SystemUserFindFirstOrThrowArgs>;

export const SystemUserFindFirstOrThrowZodSchema = z.object({ select: SystemUserFindFirstOrThrowSelectSchema.optional(), include: z.lazy(() => SystemUserIncludeObjectSchema.optional()), orderBy: z.union([SystemUserOrderByWithRelationInputObjectSchema, SystemUserOrderByWithRelationInputObjectSchema.array()]).optional(), where: SystemUserWhereInputObjectSchema.optional(), cursor: SystemUserWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([SystemUserScalarFieldEnumSchema, SystemUserScalarFieldEnumSchema.array()]).optional() }).strict();
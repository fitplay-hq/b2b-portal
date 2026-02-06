import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { SystemRoleSelectObjectSchema as SystemRoleSelectObjectSchema } from './objects/SystemRoleSelect.schema';
import { SystemRoleIncludeObjectSchema as SystemRoleIncludeObjectSchema } from './objects/SystemRoleInclude.schema';
import { SystemRoleUpdateInputObjectSchema as SystemRoleUpdateInputObjectSchema } from './objects/SystemRoleUpdateInput.schema';
import { SystemRoleUncheckedUpdateInputObjectSchema as SystemRoleUncheckedUpdateInputObjectSchema } from './objects/SystemRoleUncheckedUpdateInput.schema';
import { SystemRoleWhereUniqueInputObjectSchema as SystemRoleWhereUniqueInputObjectSchema } from './objects/SystemRoleWhereUniqueInput.schema';

export const SystemRoleUpdateOneSchema: z.ZodType<Prisma.SystemRoleUpdateArgs> = z.object({ select: SystemRoleSelectObjectSchema.optional(), include: SystemRoleIncludeObjectSchema.optional(), data: z.union([SystemRoleUpdateInputObjectSchema, SystemRoleUncheckedUpdateInputObjectSchema]), where: SystemRoleWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.SystemRoleUpdateArgs>;

export const SystemRoleUpdateOneZodSchema = z.object({ select: SystemRoleSelectObjectSchema.optional(), include: SystemRoleIncludeObjectSchema.optional(), data: z.union([SystemRoleUpdateInputObjectSchema, SystemRoleUncheckedUpdateInputObjectSchema]), where: SystemRoleWhereUniqueInputObjectSchema }).strict();
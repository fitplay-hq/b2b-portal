import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { SystemRoleSelectObjectSchema as SystemRoleSelectObjectSchema } from './objects/SystemRoleSelect.schema';
import { SystemRoleIncludeObjectSchema as SystemRoleIncludeObjectSchema } from './objects/SystemRoleInclude.schema';
import { SystemRoleWhereUniqueInputObjectSchema as SystemRoleWhereUniqueInputObjectSchema } from './objects/SystemRoleWhereUniqueInput.schema';

export const SystemRoleDeleteOneSchema: z.ZodType<Prisma.SystemRoleDeleteArgs> = z.object({ select: SystemRoleSelectObjectSchema.optional(), include: SystemRoleIncludeObjectSchema.optional(), where: SystemRoleWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.SystemRoleDeleteArgs>;

export const SystemRoleDeleteOneZodSchema = z.object({ select: SystemRoleSelectObjectSchema.optional(), include: SystemRoleIncludeObjectSchema.optional(), where: SystemRoleWhereUniqueInputObjectSchema }).strict();
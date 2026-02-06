import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { SystemRoleSelectObjectSchema as SystemRoleSelectObjectSchema } from './objects/SystemRoleSelect.schema';
import { SystemRoleIncludeObjectSchema as SystemRoleIncludeObjectSchema } from './objects/SystemRoleInclude.schema';
import { SystemRoleWhereUniqueInputObjectSchema as SystemRoleWhereUniqueInputObjectSchema } from './objects/SystemRoleWhereUniqueInput.schema';

export const SystemRoleFindUniqueOrThrowSchema: z.ZodType<Prisma.SystemRoleFindUniqueOrThrowArgs> = z.object({ select: SystemRoleSelectObjectSchema.optional(), include: SystemRoleIncludeObjectSchema.optional(), where: SystemRoleWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.SystemRoleFindUniqueOrThrowArgs>;

export const SystemRoleFindUniqueOrThrowZodSchema = z.object({ select: SystemRoleSelectObjectSchema.optional(), include: SystemRoleIncludeObjectSchema.optional(), where: SystemRoleWhereUniqueInputObjectSchema }).strict();
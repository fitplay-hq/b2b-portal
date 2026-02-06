import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { SystemRoleWhereInputObjectSchema as SystemRoleWhereInputObjectSchema } from './objects/SystemRoleWhereInput.schema';

export const SystemRoleDeleteManySchema: z.ZodType<Prisma.SystemRoleDeleteManyArgs> = z.object({ where: SystemRoleWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.SystemRoleDeleteManyArgs>;

export const SystemRoleDeleteManyZodSchema = z.object({ where: SystemRoleWhereInputObjectSchema.optional() }).strict();
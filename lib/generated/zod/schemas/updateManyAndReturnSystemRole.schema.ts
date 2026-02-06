import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { SystemRoleSelectObjectSchema as SystemRoleSelectObjectSchema } from './objects/SystemRoleSelect.schema';
import { SystemRoleUpdateManyMutationInputObjectSchema as SystemRoleUpdateManyMutationInputObjectSchema } from './objects/SystemRoleUpdateManyMutationInput.schema';
import { SystemRoleWhereInputObjectSchema as SystemRoleWhereInputObjectSchema } from './objects/SystemRoleWhereInput.schema';

export const SystemRoleUpdateManyAndReturnSchema: z.ZodType<Prisma.SystemRoleUpdateManyAndReturnArgs> = z.object({ select: SystemRoleSelectObjectSchema.optional(), data: SystemRoleUpdateManyMutationInputObjectSchema, where: SystemRoleWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.SystemRoleUpdateManyAndReturnArgs>;

export const SystemRoleUpdateManyAndReturnZodSchema = z.object({ select: SystemRoleSelectObjectSchema.optional(), data: SystemRoleUpdateManyMutationInputObjectSchema, where: SystemRoleWhereInputObjectSchema.optional() }).strict();
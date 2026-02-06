import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { SystemRoleUpdateManyMutationInputObjectSchema as SystemRoleUpdateManyMutationInputObjectSchema } from './objects/SystemRoleUpdateManyMutationInput.schema';
import { SystemRoleWhereInputObjectSchema as SystemRoleWhereInputObjectSchema } from './objects/SystemRoleWhereInput.schema';

export const SystemRoleUpdateManySchema: z.ZodType<Prisma.SystemRoleUpdateManyArgs> = z.object({ data: SystemRoleUpdateManyMutationInputObjectSchema, where: SystemRoleWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.SystemRoleUpdateManyArgs>;

export const SystemRoleUpdateManyZodSchema = z.object({ data: SystemRoleUpdateManyMutationInputObjectSchema, where: SystemRoleWhereInputObjectSchema.optional() }).strict();
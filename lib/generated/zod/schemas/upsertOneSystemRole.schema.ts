import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { SystemRoleSelectObjectSchema as SystemRoleSelectObjectSchema } from './objects/SystemRoleSelect.schema';
import { SystemRoleIncludeObjectSchema as SystemRoleIncludeObjectSchema } from './objects/SystemRoleInclude.schema';
import { SystemRoleWhereUniqueInputObjectSchema as SystemRoleWhereUniqueInputObjectSchema } from './objects/SystemRoleWhereUniqueInput.schema';
import { SystemRoleCreateInputObjectSchema as SystemRoleCreateInputObjectSchema } from './objects/SystemRoleCreateInput.schema';
import { SystemRoleUncheckedCreateInputObjectSchema as SystemRoleUncheckedCreateInputObjectSchema } from './objects/SystemRoleUncheckedCreateInput.schema';
import { SystemRoleUpdateInputObjectSchema as SystemRoleUpdateInputObjectSchema } from './objects/SystemRoleUpdateInput.schema';
import { SystemRoleUncheckedUpdateInputObjectSchema as SystemRoleUncheckedUpdateInputObjectSchema } from './objects/SystemRoleUncheckedUpdateInput.schema';

export const SystemRoleUpsertOneSchema: z.ZodType<Prisma.SystemRoleUpsertArgs> = z.object({ select: SystemRoleSelectObjectSchema.optional(), include: SystemRoleIncludeObjectSchema.optional(), where: SystemRoleWhereUniqueInputObjectSchema, create: z.union([ SystemRoleCreateInputObjectSchema, SystemRoleUncheckedCreateInputObjectSchema ]), update: z.union([ SystemRoleUpdateInputObjectSchema, SystemRoleUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.SystemRoleUpsertArgs>;

export const SystemRoleUpsertOneZodSchema = z.object({ select: SystemRoleSelectObjectSchema.optional(), include: SystemRoleIncludeObjectSchema.optional(), where: SystemRoleWhereUniqueInputObjectSchema, create: z.union([ SystemRoleCreateInputObjectSchema, SystemRoleUncheckedCreateInputObjectSchema ]), update: z.union([ SystemRoleUpdateInputObjectSchema, SystemRoleUncheckedUpdateInputObjectSchema ]) }).strict();
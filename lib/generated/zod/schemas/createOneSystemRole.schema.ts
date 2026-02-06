import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { SystemRoleSelectObjectSchema as SystemRoleSelectObjectSchema } from './objects/SystemRoleSelect.schema';
import { SystemRoleIncludeObjectSchema as SystemRoleIncludeObjectSchema } from './objects/SystemRoleInclude.schema';
import { SystemRoleCreateInputObjectSchema as SystemRoleCreateInputObjectSchema } from './objects/SystemRoleCreateInput.schema';
import { SystemRoleUncheckedCreateInputObjectSchema as SystemRoleUncheckedCreateInputObjectSchema } from './objects/SystemRoleUncheckedCreateInput.schema';

export const SystemRoleCreateOneSchema: z.ZodType<Prisma.SystemRoleCreateArgs> = z.object({ select: SystemRoleSelectObjectSchema.optional(), include: SystemRoleIncludeObjectSchema.optional(), data: z.union([SystemRoleCreateInputObjectSchema, SystemRoleUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.SystemRoleCreateArgs>;

export const SystemRoleCreateOneZodSchema = z.object({ select: SystemRoleSelectObjectSchema.optional(), include: SystemRoleIncludeObjectSchema.optional(), data: z.union([SystemRoleCreateInputObjectSchema, SystemRoleUncheckedCreateInputObjectSchema]) }).strict();
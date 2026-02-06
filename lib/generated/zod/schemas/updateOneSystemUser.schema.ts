import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { SystemUserSelectObjectSchema as SystemUserSelectObjectSchema } from './objects/SystemUserSelect.schema';
import { SystemUserIncludeObjectSchema as SystemUserIncludeObjectSchema } from './objects/SystemUserInclude.schema';
import { SystemUserUpdateInputObjectSchema as SystemUserUpdateInputObjectSchema } from './objects/SystemUserUpdateInput.schema';
import { SystemUserUncheckedUpdateInputObjectSchema as SystemUserUncheckedUpdateInputObjectSchema } from './objects/SystemUserUncheckedUpdateInput.schema';
import { SystemUserWhereUniqueInputObjectSchema as SystemUserWhereUniqueInputObjectSchema } from './objects/SystemUserWhereUniqueInput.schema';

export const SystemUserUpdateOneSchema: z.ZodType<Prisma.SystemUserUpdateArgs> = z.object({ select: SystemUserSelectObjectSchema.optional(), include: SystemUserIncludeObjectSchema.optional(), data: z.union([SystemUserUpdateInputObjectSchema, SystemUserUncheckedUpdateInputObjectSchema]), where: SystemUserWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.SystemUserUpdateArgs>;

export const SystemUserUpdateOneZodSchema = z.object({ select: SystemUserSelectObjectSchema.optional(), include: SystemUserIncludeObjectSchema.optional(), data: z.union([SystemUserUpdateInputObjectSchema, SystemUserUncheckedUpdateInputObjectSchema]), where: SystemUserWhereUniqueInputObjectSchema }).strict();
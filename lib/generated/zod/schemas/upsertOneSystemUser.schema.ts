import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { SystemUserSelectObjectSchema as SystemUserSelectObjectSchema } from './objects/SystemUserSelect.schema';
import { SystemUserIncludeObjectSchema as SystemUserIncludeObjectSchema } from './objects/SystemUserInclude.schema';
import { SystemUserWhereUniqueInputObjectSchema as SystemUserWhereUniqueInputObjectSchema } from './objects/SystemUserWhereUniqueInput.schema';
import { SystemUserCreateInputObjectSchema as SystemUserCreateInputObjectSchema } from './objects/SystemUserCreateInput.schema';
import { SystemUserUncheckedCreateInputObjectSchema as SystemUserUncheckedCreateInputObjectSchema } from './objects/SystemUserUncheckedCreateInput.schema';
import { SystemUserUpdateInputObjectSchema as SystemUserUpdateInputObjectSchema } from './objects/SystemUserUpdateInput.schema';
import { SystemUserUncheckedUpdateInputObjectSchema as SystemUserUncheckedUpdateInputObjectSchema } from './objects/SystemUserUncheckedUpdateInput.schema';

export const SystemUserUpsertOneSchema: z.ZodType<Prisma.SystemUserUpsertArgs> = z.object({ select: SystemUserSelectObjectSchema.optional(), include: SystemUserIncludeObjectSchema.optional(), where: SystemUserWhereUniqueInputObjectSchema, create: z.union([ SystemUserCreateInputObjectSchema, SystemUserUncheckedCreateInputObjectSchema ]), update: z.union([ SystemUserUpdateInputObjectSchema, SystemUserUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.SystemUserUpsertArgs>;

export const SystemUserUpsertOneZodSchema = z.object({ select: SystemUserSelectObjectSchema.optional(), include: SystemUserIncludeObjectSchema.optional(), where: SystemUserWhereUniqueInputObjectSchema, create: z.union([ SystemUserCreateInputObjectSchema, SystemUserUncheckedCreateInputObjectSchema ]), update: z.union([ SystemUserUpdateInputObjectSchema, SystemUserUncheckedUpdateInputObjectSchema ]) }).strict();
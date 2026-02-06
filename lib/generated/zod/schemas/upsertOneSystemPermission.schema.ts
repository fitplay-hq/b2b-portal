import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { SystemPermissionSelectObjectSchema as SystemPermissionSelectObjectSchema } from './objects/SystemPermissionSelect.schema';
import { SystemPermissionIncludeObjectSchema as SystemPermissionIncludeObjectSchema } from './objects/SystemPermissionInclude.schema';
import { SystemPermissionWhereUniqueInputObjectSchema as SystemPermissionWhereUniqueInputObjectSchema } from './objects/SystemPermissionWhereUniqueInput.schema';
import { SystemPermissionCreateInputObjectSchema as SystemPermissionCreateInputObjectSchema } from './objects/SystemPermissionCreateInput.schema';
import { SystemPermissionUncheckedCreateInputObjectSchema as SystemPermissionUncheckedCreateInputObjectSchema } from './objects/SystemPermissionUncheckedCreateInput.schema';
import { SystemPermissionUpdateInputObjectSchema as SystemPermissionUpdateInputObjectSchema } from './objects/SystemPermissionUpdateInput.schema';
import { SystemPermissionUncheckedUpdateInputObjectSchema as SystemPermissionUncheckedUpdateInputObjectSchema } from './objects/SystemPermissionUncheckedUpdateInput.schema';

export const SystemPermissionUpsertOneSchema: z.ZodType<Prisma.SystemPermissionUpsertArgs> = z.object({ select: SystemPermissionSelectObjectSchema.optional(), include: SystemPermissionIncludeObjectSchema.optional(), where: SystemPermissionWhereUniqueInputObjectSchema, create: z.union([ SystemPermissionCreateInputObjectSchema, SystemPermissionUncheckedCreateInputObjectSchema ]), update: z.union([ SystemPermissionUpdateInputObjectSchema, SystemPermissionUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.SystemPermissionUpsertArgs>;

export const SystemPermissionUpsertOneZodSchema = z.object({ select: SystemPermissionSelectObjectSchema.optional(), include: SystemPermissionIncludeObjectSchema.optional(), where: SystemPermissionWhereUniqueInputObjectSchema, create: z.union([ SystemPermissionCreateInputObjectSchema, SystemPermissionUncheckedCreateInputObjectSchema ]), update: z.union([ SystemPermissionUpdateInputObjectSchema, SystemPermissionUncheckedUpdateInputObjectSchema ]) }).strict();
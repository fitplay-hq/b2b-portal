import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { SystemPermissionSelectObjectSchema as SystemPermissionSelectObjectSchema } from './objects/SystemPermissionSelect.schema';
import { SystemPermissionIncludeObjectSchema as SystemPermissionIncludeObjectSchema } from './objects/SystemPermissionInclude.schema';
import { SystemPermissionUpdateInputObjectSchema as SystemPermissionUpdateInputObjectSchema } from './objects/SystemPermissionUpdateInput.schema';
import { SystemPermissionUncheckedUpdateInputObjectSchema as SystemPermissionUncheckedUpdateInputObjectSchema } from './objects/SystemPermissionUncheckedUpdateInput.schema';
import { SystemPermissionWhereUniqueInputObjectSchema as SystemPermissionWhereUniqueInputObjectSchema } from './objects/SystemPermissionWhereUniqueInput.schema';

export const SystemPermissionUpdateOneSchema: z.ZodType<Prisma.SystemPermissionUpdateArgs> = z.object({ select: SystemPermissionSelectObjectSchema.optional(), include: SystemPermissionIncludeObjectSchema.optional(), data: z.union([SystemPermissionUpdateInputObjectSchema, SystemPermissionUncheckedUpdateInputObjectSchema]), where: SystemPermissionWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.SystemPermissionUpdateArgs>;

export const SystemPermissionUpdateOneZodSchema = z.object({ select: SystemPermissionSelectObjectSchema.optional(), include: SystemPermissionIncludeObjectSchema.optional(), data: z.union([SystemPermissionUpdateInputObjectSchema, SystemPermissionUncheckedUpdateInputObjectSchema]), where: SystemPermissionWhereUniqueInputObjectSchema }).strict();
import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { SystemPermissionSelectObjectSchema as SystemPermissionSelectObjectSchema } from './objects/SystemPermissionSelect.schema';
import { SystemPermissionIncludeObjectSchema as SystemPermissionIncludeObjectSchema } from './objects/SystemPermissionInclude.schema';
import { SystemPermissionWhereUniqueInputObjectSchema as SystemPermissionWhereUniqueInputObjectSchema } from './objects/SystemPermissionWhereUniqueInput.schema';

export const SystemPermissionDeleteOneSchema: z.ZodType<Prisma.SystemPermissionDeleteArgs> = z.object({ select: SystemPermissionSelectObjectSchema.optional(), include: SystemPermissionIncludeObjectSchema.optional(), where: SystemPermissionWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.SystemPermissionDeleteArgs>;

export const SystemPermissionDeleteOneZodSchema = z.object({ select: SystemPermissionSelectObjectSchema.optional(), include: SystemPermissionIncludeObjectSchema.optional(), where: SystemPermissionWhereUniqueInputObjectSchema }).strict();
import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { SystemPermissionSelectObjectSchema as SystemPermissionSelectObjectSchema } from './objects/SystemPermissionSelect.schema';
import { SystemPermissionIncludeObjectSchema as SystemPermissionIncludeObjectSchema } from './objects/SystemPermissionInclude.schema';
import { SystemPermissionWhereUniqueInputObjectSchema as SystemPermissionWhereUniqueInputObjectSchema } from './objects/SystemPermissionWhereUniqueInput.schema';

export const SystemPermissionFindUniqueSchema: z.ZodType<Prisma.SystemPermissionFindUniqueArgs> = z.object({ select: SystemPermissionSelectObjectSchema.optional(), include: SystemPermissionIncludeObjectSchema.optional(), where: SystemPermissionWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.SystemPermissionFindUniqueArgs>;

export const SystemPermissionFindUniqueZodSchema = z.object({ select: SystemPermissionSelectObjectSchema.optional(), include: SystemPermissionIncludeObjectSchema.optional(), where: SystemPermissionWhereUniqueInputObjectSchema }).strict();
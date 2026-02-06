import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { SystemPermissionSelectObjectSchema as SystemPermissionSelectObjectSchema } from './objects/SystemPermissionSelect.schema';
import { SystemPermissionIncludeObjectSchema as SystemPermissionIncludeObjectSchema } from './objects/SystemPermissionInclude.schema';
import { SystemPermissionCreateInputObjectSchema as SystemPermissionCreateInputObjectSchema } from './objects/SystemPermissionCreateInput.schema';
import { SystemPermissionUncheckedCreateInputObjectSchema as SystemPermissionUncheckedCreateInputObjectSchema } from './objects/SystemPermissionUncheckedCreateInput.schema';

export const SystemPermissionCreateOneSchema: z.ZodType<Prisma.SystemPermissionCreateArgs> = z.object({ select: SystemPermissionSelectObjectSchema.optional(), include: SystemPermissionIncludeObjectSchema.optional(), data: z.union([SystemPermissionCreateInputObjectSchema, SystemPermissionUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.SystemPermissionCreateArgs>;

export const SystemPermissionCreateOneZodSchema = z.object({ select: SystemPermissionSelectObjectSchema.optional(), include: SystemPermissionIncludeObjectSchema.optional(), data: z.union([SystemPermissionCreateInputObjectSchema, SystemPermissionUncheckedCreateInputObjectSchema]) }).strict();
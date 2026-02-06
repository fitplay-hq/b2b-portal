import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { SystemUserSelectObjectSchema as SystemUserSelectObjectSchema } from './objects/SystemUserSelect.schema';
import { SystemUserIncludeObjectSchema as SystemUserIncludeObjectSchema } from './objects/SystemUserInclude.schema';
import { SystemUserCreateInputObjectSchema as SystemUserCreateInputObjectSchema } from './objects/SystemUserCreateInput.schema';
import { SystemUserUncheckedCreateInputObjectSchema as SystemUserUncheckedCreateInputObjectSchema } from './objects/SystemUserUncheckedCreateInput.schema';

export const SystemUserCreateOneSchema: z.ZodType<Prisma.SystemUserCreateArgs> = z.object({ select: SystemUserSelectObjectSchema.optional(), include: SystemUserIncludeObjectSchema.optional(), data: z.union([SystemUserCreateInputObjectSchema, SystemUserUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.SystemUserCreateArgs>;

export const SystemUserCreateOneZodSchema = z.object({ select: SystemUserSelectObjectSchema.optional(), include: SystemUserIncludeObjectSchema.optional(), data: z.union([SystemUserCreateInputObjectSchema, SystemUserUncheckedCreateInputObjectSchema]) }).strict();
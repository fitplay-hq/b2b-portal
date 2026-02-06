import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { SystemUserSelectObjectSchema as SystemUserSelectObjectSchema } from './objects/SystemUserSelect.schema';
import { SystemUserIncludeObjectSchema as SystemUserIncludeObjectSchema } from './objects/SystemUserInclude.schema';
import { SystemUserWhereUniqueInputObjectSchema as SystemUserWhereUniqueInputObjectSchema } from './objects/SystemUserWhereUniqueInput.schema';

export const SystemUserDeleteOneSchema: z.ZodType<Prisma.SystemUserDeleteArgs> = z.object({ select: SystemUserSelectObjectSchema.optional(), include: SystemUserIncludeObjectSchema.optional(), where: SystemUserWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.SystemUserDeleteArgs>;

export const SystemUserDeleteOneZodSchema = z.object({ select: SystemUserSelectObjectSchema.optional(), include: SystemUserIncludeObjectSchema.optional(), where: SystemUserWhereUniqueInputObjectSchema }).strict();
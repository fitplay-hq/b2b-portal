import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { SystemUserSelectObjectSchema as SystemUserSelectObjectSchema } from './objects/SystemUserSelect.schema';
import { SystemUserIncludeObjectSchema as SystemUserIncludeObjectSchema } from './objects/SystemUserInclude.schema';
import { SystemUserWhereUniqueInputObjectSchema as SystemUserWhereUniqueInputObjectSchema } from './objects/SystemUserWhereUniqueInput.schema';

export const SystemUserFindUniqueSchema: z.ZodType<Prisma.SystemUserFindUniqueArgs> = z.object({ select: SystemUserSelectObjectSchema.optional(), include: SystemUserIncludeObjectSchema.optional(), where: SystemUserWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.SystemUserFindUniqueArgs>;

export const SystemUserFindUniqueZodSchema = z.object({ select: SystemUserSelectObjectSchema.optional(), include: SystemUserIncludeObjectSchema.optional(), where: SystemUserWhereUniqueInputObjectSchema }).strict();
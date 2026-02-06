import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { SystemUserSelectObjectSchema as SystemUserSelectObjectSchema } from './objects/SystemUserSelect.schema';
import { SystemUserCreateManyInputObjectSchema as SystemUserCreateManyInputObjectSchema } from './objects/SystemUserCreateManyInput.schema';

export const SystemUserCreateManyAndReturnSchema: z.ZodType<Prisma.SystemUserCreateManyAndReturnArgs> = z.object({ select: SystemUserSelectObjectSchema.optional(), data: z.union([ SystemUserCreateManyInputObjectSchema, z.array(SystemUserCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.SystemUserCreateManyAndReturnArgs>;

export const SystemUserCreateManyAndReturnZodSchema = z.object({ select: SystemUserSelectObjectSchema.optional(), data: z.union([ SystemUserCreateManyInputObjectSchema, z.array(SystemUserCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();
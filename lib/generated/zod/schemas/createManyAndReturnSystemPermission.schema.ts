import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { SystemPermissionSelectObjectSchema as SystemPermissionSelectObjectSchema } from './objects/SystemPermissionSelect.schema';
import { SystemPermissionCreateManyInputObjectSchema as SystemPermissionCreateManyInputObjectSchema } from './objects/SystemPermissionCreateManyInput.schema';

export const SystemPermissionCreateManyAndReturnSchema: z.ZodType<Prisma.SystemPermissionCreateManyAndReturnArgs> = z.object({ select: SystemPermissionSelectObjectSchema.optional(), data: z.union([ SystemPermissionCreateManyInputObjectSchema, z.array(SystemPermissionCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.SystemPermissionCreateManyAndReturnArgs>;

export const SystemPermissionCreateManyAndReturnZodSchema = z.object({ select: SystemPermissionSelectObjectSchema.optional(), data: z.union([ SystemPermissionCreateManyInputObjectSchema, z.array(SystemPermissionCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();
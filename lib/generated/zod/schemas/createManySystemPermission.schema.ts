import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { SystemPermissionCreateManyInputObjectSchema as SystemPermissionCreateManyInputObjectSchema } from './objects/SystemPermissionCreateManyInput.schema';

export const SystemPermissionCreateManySchema: z.ZodType<Prisma.SystemPermissionCreateManyArgs> = z.object({ data: z.union([ SystemPermissionCreateManyInputObjectSchema, z.array(SystemPermissionCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.SystemPermissionCreateManyArgs>;

export const SystemPermissionCreateManyZodSchema = z.object({ data: z.union([ SystemPermissionCreateManyInputObjectSchema, z.array(SystemPermissionCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();
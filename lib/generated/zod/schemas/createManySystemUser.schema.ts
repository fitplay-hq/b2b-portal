import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { SystemUserCreateManyInputObjectSchema as SystemUserCreateManyInputObjectSchema } from './objects/SystemUserCreateManyInput.schema';

export const SystemUserCreateManySchema: z.ZodType<Prisma.SystemUserCreateManyArgs> = z.object({ data: z.union([ SystemUserCreateManyInputObjectSchema, z.array(SystemUserCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.SystemUserCreateManyArgs>;

export const SystemUserCreateManyZodSchema = z.object({ data: z.union([ SystemUserCreateManyInputObjectSchema, z.array(SystemUserCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();
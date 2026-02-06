import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { SystemRoleCreateManyInputObjectSchema as SystemRoleCreateManyInputObjectSchema } from './objects/SystemRoleCreateManyInput.schema';

export const SystemRoleCreateManySchema: z.ZodType<Prisma.SystemRoleCreateManyArgs> = z.object({ data: z.union([ SystemRoleCreateManyInputObjectSchema, z.array(SystemRoleCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.SystemRoleCreateManyArgs>;

export const SystemRoleCreateManyZodSchema = z.object({ data: z.union([ SystemRoleCreateManyInputObjectSchema, z.array(SystemRoleCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();
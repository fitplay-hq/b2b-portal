import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { SystemRoleSelectObjectSchema as SystemRoleSelectObjectSchema } from './objects/SystemRoleSelect.schema';
import { SystemRoleCreateManyInputObjectSchema as SystemRoleCreateManyInputObjectSchema } from './objects/SystemRoleCreateManyInput.schema';

export const SystemRoleCreateManyAndReturnSchema: z.ZodType<Prisma.SystemRoleCreateManyAndReturnArgs> = z.object({ select: SystemRoleSelectObjectSchema.optional(), data: z.union([ SystemRoleCreateManyInputObjectSchema, z.array(SystemRoleCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.SystemRoleCreateManyAndReturnArgs>;

export const SystemRoleCreateManyAndReturnZodSchema = z.object({ select: SystemRoleSelectObjectSchema.optional(), data: z.union([ SystemRoleCreateManyInputObjectSchema, z.array(SystemRoleCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();
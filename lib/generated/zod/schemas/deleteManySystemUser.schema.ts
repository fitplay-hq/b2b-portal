import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { SystemUserWhereInputObjectSchema as SystemUserWhereInputObjectSchema } from './objects/SystemUserWhereInput.schema';

export const SystemUserDeleteManySchema: z.ZodType<Prisma.SystemUserDeleteManyArgs> = z.object({ where: SystemUserWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.SystemUserDeleteManyArgs>;

export const SystemUserDeleteManyZodSchema = z.object({ where: SystemUserWhereInputObjectSchema.optional() }).strict();
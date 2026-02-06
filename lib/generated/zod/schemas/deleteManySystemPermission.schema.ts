import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { SystemPermissionWhereInputObjectSchema as SystemPermissionWhereInputObjectSchema } from './objects/SystemPermissionWhereInput.schema';

export const SystemPermissionDeleteManySchema: z.ZodType<Prisma.SystemPermissionDeleteManyArgs> = z.object({ where: SystemPermissionWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.SystemPermissionDeleteManyArgs>;

export const SystemPermissionDeleteManyZodSchema = z.object({ where: SystemPermissionWhereInputObjectSchema.optional() }).strict();
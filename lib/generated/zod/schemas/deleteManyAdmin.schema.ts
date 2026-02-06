import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { AdminWhereInputObjectSchema as AdminWhereInputObjectSchema } from './objects/AdminWhereInput.schema';

export const AdminDeleteManySchema: z.ZodType<Prisma.AdminDeleteManyArgs> = z.object({ where: AdminWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.AdminDeleteManyArgs>;

export const AdminDeleteManyZodSchema = z.object({ where: AdminWhereInputObjectSchema.optional() }).strict();
import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { AdminSelectObjectSchema as AdminSelectObjectSchema } from './objects/AdminSelect.schema';
import { AdminWhereUniqueInputObjectSchema as AdminWhereUniqueInputObjectSchema } from './objects/AdminWhereUniqueInput.schema';

export const AdminDeleteOneSchema: z.ZodType<Prisma.AdminDeleteArgs> = z.object({ select: AdminSelectObjectSchema.optional(),  where: AdminWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.AdminDeleteArgs>;

export const AdminDeleteOneZodSchema = z.object({ select: AdminSelectObjectSchema.optional(),  where: AdminWhereUniqueInputObjectSchema }).strict();
import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { AdminSelectObjectSchema as AdminSelectObjectSchema } from './objects/AdminSelect.schema';
import { AdminWhereUniqueInputObjectSchema as AdminWhereUniqueInputObjectSchema } from './objects/AdminWhereUniqueInput.schema';

export const AdminFindUniqueSchema: z.ZodType<Prisma.AdminFindUniqueArgs> = z.object({ select: AdminSelectObjectSchema.optional(),  where: AdminWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.AdminFindUniqueArgs>;

export const AdminFindUniqueZodSchema = z.object({ select: AdminSelectObjectSchema.optional(),  where: AdminWhereUniqueInputObjectSchema }).strict();
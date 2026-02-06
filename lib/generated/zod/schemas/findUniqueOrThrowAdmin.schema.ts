import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { AdminSelectObjectSchema as AdminSelectObjectSchema } from './objects/AdminSelect.schema';
import { AdminWhereUniqueInputObjectSchema as AdminWhereUniqueInputObjectSchema } from './objects/AdminWhereUniqueInput.schema';

export const AdminFindUniqueOrThrowSchema: z.ZodType<Prisma.AdminFindUniqueOrThrowArgs> = z.object({ select: AdminSelectObjectSchema.optional(),  where: AdminWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.AdminFindUniqueOrThrowArgs>;

export const AdminFindUniqueOrThrowZodSchema = z.object({ select: AdminSelectObjectSchema.optional(),  where: AdminWhereUniqueInputObjectSchema }).strict();
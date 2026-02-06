import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { AdminSelectObjectSchema as AdminSelectObjectSchema } from './objects/AdminSelect.schema';
import { AdminUpdateInputObjectSchema as AdminUpdateInputObjectSchema } from './objects/AdminUpdateInput.schema';
import { AdminUncheckedUpdateInputObjectSchema as AdminUncheckedUpdateInputObjectSchema } from './objects/AdminUncheckedUpdateInput.schema';
import { AdminWhereUniqueInputObjectSchema as AdminWhereUniqueInputObjectSchema } from './objects/AdminWhereUniqueInput.schema';

export const AdminUpdateOneSchema: z.ZodType<Prisma.AdminUpdateArgs> = z.object({ select: AdminSelectObjectSchema.optional(),  data: z.union([AdminUpdateInputObjectSchema, AdminUncheckedUpdateInputObjectSchema]), where: AdminWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.AdminUpdateArgs>;

export const AdminUpdateOneZodSchema = z.object({ select: AdminSelectObjectSchema.optional(),  data: z.union([AdminUpdateInputObjectSchema, AdminUncheckedUpdateInputObjectSchema]), where: AdminWhereUniqueInputObjectSchema }).strict();
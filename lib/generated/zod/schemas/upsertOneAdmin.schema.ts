import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { AdminSelectObjectSchema as AdminSelectObjectSchema } from './objects/AdminSelect.schema';
import { AdminWhereUniqueInputObjectSchema as AdminWhereUniqueInputObjectSchema } from './objects/AdminWhereUniqueInput.schema';
import { AdminCreateInputObjectSchema as AdminCreateInputObjectSchema } from './objects/AdminCreateInput.schema';
import { AdminUncheckedCreateInputObjectSchema as AdminUncheckedCreateInputObjectSchema } from './objects/AdminUncheckedCreateInput.schema';
import { AdminUpdateInputObjectSchema as AdminUpdateInputObjectSchema } from './objects/AdminUpdateInput.schema';
import { AdminUncheckedUpdateInputObjectSchema as AdminUncheckedUpdateInputObjectSchema } from './objects/AdminUncheckedUpdateInput.schema';

export const AdminUpsertOneSchema: z.ZodType<Prisma.AdminUpsertArgs> = z.object({ select: AdminSelectObjectSchema.optional(),  where: AdminWhereUniqueInputObjectSchema, create: z.union([ AdminCreateInputObjectSchema, AdminUncheckedCreateInputObjectSchema ]), update: z.union([ AdminUpdateInputObjectSchema, AdminUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.AdminUpsertArgs>;

export const AdminUpsertOneZodSchema = z.object({ select: AdminSelectObjectSchema.optional(),  where: AdminWhereUniqueInputObjectSchema, create: z.union([ AdminCreateInputObjectSchema, AdminUncheckedCreateInputObjectSchema ]), update: z.union([ AdminUpdateInputObjectSchema, AdminUncheckedUpdateInputObjectSchema ]) }).strict();
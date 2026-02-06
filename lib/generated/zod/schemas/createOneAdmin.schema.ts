import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { AdminSelectObjectSchema as AdminSelectObjectSchema } from './objects/AdminSelect.schema';
import { AdminCreateInputObjectSchema as AdminCreateInputObjectSchema } from './objects/AdminCreateInput.schema';
import { AdminUncheckedCreateInputObjectSchema as AdminUncheckedCreateInputObjectSchema } from './objects/AdminUncheckedCreateInput.schema';

export const AdminCreateOneSchema: z.ZodType<Prisma.AdminCreateArgs> = z.object({ select: AdminSelectObjectSchema.optional(),  data: z.union([AdminCreateInputObjectSchema, AdminUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.AdminCreateArgs>;

export const AdminCreateOneZodSchema = z.object({ select: AdminSelectObjectSchema.optional(),  data: z.union([AdminCreateInputObjectSchema, AdminUncheckedCreateInputObjectSchema]) }).strict();
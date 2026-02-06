import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { AdminSelectObjectSchema as AdminSelectObjectSchema } from './objects/AdminSelect.schema';
import { AdminUpdateManyMutationInputObjectSchema as AdminUpdateManyMutationInputObjectSchema } from './objects/AdminUpdateManyMutationInput.schema';
import { AdminWhereInputObjectSchema as AdminWhereInputObjectSchema } from './objects/AdminWhereInput.schema';

export const AdminUpdateManyAndReturnSchema: z.ZodType<Prisma.AdminUpdateManyAndReturnArgs> = z.object({ select: AdminSelectObjectSchema.optional(), data: AdminUpdateManyMutationInputObjectSchema, where: AdminWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.AdminUpdateManyAndReturnArgs>;

export const AdminUpdateManyAndReturnZodSchema = z.object({ select: AdminSelectObjectSchema.optional(), data: AdminUpdateManyMutationInputObjectSchema, where: AdminWhereInputObjectSchema.optional() }).strict();
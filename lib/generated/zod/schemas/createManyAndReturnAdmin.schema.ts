import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { AdminSelectObjectSchema as AdminSelectObjectSchema } from './objects/AdminSelect.schema';
import { AdminCreateManyInputObjectSchema as AdminCreateManyInputObjectSchema } from './objects/AdminCreateManyInput.schema';

export const AdminCreateManyAndReturnSchema: z.ZodType<Prisma.AdminCreateManyAndReturnArgs> = z.object({ select: AdminSelectObjectSchema.optional(), data: z.union([ AdminCreateManyInputObjectSchema, z.array(AdminCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.AdminCreateManyAndReturnArgs>;

export const AdminCreateManyAndReturnZodSchema = z.object({ select: AdminSelectObjectSchema.optional(), data: z.union([ AdminCreateManyInputObjectSchema, z.array(AdminCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();
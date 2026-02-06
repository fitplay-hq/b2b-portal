import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { ResetTokenCreateManyInputObjectSchema as ResetTokenCreateManyInputObjectSchema } from './objects/ResetTokenCreateManyInput.schema';

export const ResetTokenCreateManySchema: z.ZodType<Prisma.ResetTokenCreateManyArgs> = z.object({ data: z.union([ ResetTokenCreateManyInputObjectSchema, z.array(ResetTokenCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.ResetTokenCreateManyArgs>;

export const ResetTokenCreateManyZodSchema = z.object({ data: z.union([ ResetTokenCreateManyInputObjectSchema, z.array(ResetTokenCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();
import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { ResetTokenSelectObjectSchema as ResetTokenSelectObjectSchema } from './objects/ResetTokenSelect.schema';
import { ResetTokenCreateManyInputObjectSchema as ResetTokenCreateManyInputObjectSchema } from './objects/ResetTokenCreateManyInput.schema';

export const ResetTokenCreateManyAndReturnSchema: z.ZodType<Prisma.ResetTokenCreateManyAndReturnArgs> = z.object({ select: ResetTokenSelectObjectSchema.optional(), data: z.union([ ResetTokenCreateManyInputObjectSchema, z.array(ResetTokenCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.ResetTokenCreateManyAndReturnArgs>;

export const ResetTokenCreateManyAndReturnZodSchema = z.object({ select: ResetTokenSelectObjectSchema.optional(), data: z.union([ ResetTokenCreateManyInputObjectSchema, z.array(ResetTokenCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();
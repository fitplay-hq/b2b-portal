import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { ResetTokenWhereInputObjectSchema as ResetTokenWhereInputObjectSchema } from './objects/ResetTokenWhereInput.schema';

export const ResetTokenDeleteManySchema: z.ZodType<Prisma.ResetTokenDeleteManyArgs> = z.object({ where: ResetTokenWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.ResetTokenDeleteManyArgs>;

export const ResetTokenDeleteManyZodSchema = z.object({ where: ResetTokenWhereInputObjectSchema.optional() }).strict();
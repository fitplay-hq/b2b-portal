import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { ResetTokenSelectObjectSchema as ResetTokenSelectObjectSchema } from './objects/ResetTokenSelect.schema';
import { ResetTokenWhereUniqueInputObjectSchema as ResetTokenWhereUniqueInputObjectSchema } from './objects/ResetTokenWhereUniqueInput.schema';

export const ResetTokenDeleteOneSchema: z.ZodType<Prisma.ResetTokenDeleteArgs> = z.object({ select: ResetTokenSelectObjectSchema.optional(),  where: ResetTokenWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.ResetTokenDeleteArgs>;

export const ResetTokenDeleteOneZodSchema = z.object({ select: ResetTokenSelectObjectSchema.optional(),  where: ResetTokenWhereUniqueInputObjectSchema }).strict();
import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { ResetTokenSelectObjectSchema as ResetTokenSelectObjectSchema } from './objects/ResetTokenSelect.schema';
import { ResetTokenWhereUniqueInputObjectSchema as ResetTokenWhereUniqueInputObjectSchema } from './objects/ResetTokenWhereUniqueInput.schema';

export const ResetTokenFindUniqueSchema: z.ZodType<Prisma.ResetTokenFindUniqueArgs> = z.object({ select: ResetTokenSelectObjectSchema.optional(),  where: ResetTokenWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.ResetTokenFindUniqueArgs>;

export const ResetTokenFindUniqueZodSchema = z.object({ select: ResetTokenSelectObjectSchema.optional(),  where: ResetTokenWhereUniqueInputObjectSchema }).strict();
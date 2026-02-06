import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { ResetTokenSelectObjectSchema as ResetTokenSelectObjectSchema } from './objects/ResetTokenSelect.schema';
import { ResetTokenWhereUniqueInputObjectSchema as ResetTokenWhereUniqueInputObjectSchema } from './objects/ResetTokenWhereUniqueInput.schema';

export const ResetTokenFindUniqueOrThrowSchema: z.ZodType<Prisma.ResetTokenFindUniqueOrThrowArgs> = z.object({ select: ResetTokenSelectObjectSchema.optional(),  where: ResetTokenWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.ResetTokenFindUniqueOrThrowArgs>;

export const ResetTokenFindUniqueOrThrowZodSchema = z.object({ select: ResetTokenSelectObjectSchema.optional(),  where: ResetTokenWhereUniqueInputObjectSchema }).strict();
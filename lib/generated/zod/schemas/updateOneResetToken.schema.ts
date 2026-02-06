import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { ResetTokenSelectObjectSchema as ResetTokenSelectObjectSchema } from './objects/ResetTokenSelect.schema';
import { ResetTokenUpdateInputObjectSchema as ResetTokenUpdateInputObjectSchema } from './objects/ResetTokenUpdateInput.schema';
import { ResetTokenUncheckedUpdateInputObjectSchema as ResetTokenUncheckedUpdateInputObjectSchema } from './objects/ResetTokenUncheckedUpdateInput.schema';
import { ResetTokenWhereUniqueInputObjectSchema as ResetTokenWhereUniqueInputObjectSchema } from './objects/ResetTokenWhereUniqueInput.schema';

export const ResetTokenUpdateOneSchema: z.ZodType<Prisma.ResetTokenUpdateArgs> = z.object({ select: ResetTokenSelectObjectSchema.optional(),  data: z.union([ResetTokenUpdateInputObjectSchema, ResetTokenUncheckedUpdateInputObjectSchema]), where: ResetTokenWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.ResetTokenUpdateArgs>;

export const ResetTokenUpdateOneZodSchema = z.object({ select: ResetTokenSelectObjectSchema.optional(),  data: z.union([ResetTokenUpdateInputObjectSchema, ResetTokenUncheckedUpdateInputObjectSchema]), where: ResetTokenWhereUniqueInputObjectSchema }).strict();
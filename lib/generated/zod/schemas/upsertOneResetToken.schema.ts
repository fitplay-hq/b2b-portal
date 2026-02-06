import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { ResetTokenSelectObjectSchema as ResetTokenSelectObjectSchema } from './objects/ResetTokenSelect.schema';
import { ResetTokenWhereUniqueInputObjectSchema as ResetTokenWhereUniqueInputObjectSchema } from './objects/ResetTokenWhereUniqueInput.schema';
import { ResetTokenCreateInputObjectSchema as ResetTokenCreateInputObjectSchema } from './objects/ResetTokenCreateInput.schema';
import { ResetTokenUncheckedCreateInputObjectSchema as ResetTokenUncheckedCreateInputObjectSchema } from './objects/ResetTokenUncheckedCreateInput.schema';
import { ResetTokenUpdateInputObjectSchema as ResetTokenUpdateInputObjectSchema } from './objects/ResetTokenUpdateInput.schema';
import { ResetTokenUncheckedUpdateInputObjectSchema as ResetTokenUncheckedUpdateInputObjectSchema } from './objects/ResetTokenUncheckedUpdateInput.schema';

export const ResetTokenUpsertOneSchema: z.ZodType<Prisma.ResetTokenUpsertArgs> = z.object({ select: ResetTokenSelectObjectSchema.optional(),  where: ResetTokenWhereUniqueInputObjectSchema, create: z.union([ ResetTokenCreateInputObjectSchema, ResetTokenUncheckedCreateInputObjectSchema ]), update: z.union([ ResetTokenUpdateInputObjectSchema, ResetTokenUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.ResetTokenUpsertArgs>;

export const ResetTokenUpsertOneZodSchema = z.object({ select: ResetTokenSelectObjectSchema.optional(),  where: ResetTokenWhereUniqueInputObjectSchema, create: z.union([ ResetTokenCreateInputObjectSchema, ResetTokenUncheckedCreateInputObjectSchema ]), update: z.union([ ResetTokenUpdateInputObjectSchema, ResetTokenUncheckedUpdateInputObjectSchema ]) }).strict();
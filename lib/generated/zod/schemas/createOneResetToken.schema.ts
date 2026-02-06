import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { ResetTokenSelectObjectSchema as ResetTokenSelectObjectSchema } from './objects/ResetTokenSelect.schema';
import { ResetTokenCreateInputObjectSchema as ResetTokenCreateInputObjectSchema } from './objects/ResetTokenCreateInput.schema';
import { ResetTokenUncheckedCreateInputObjectSchema as ResetTokenUncheckedCreateInputObjectSchema } from './objects/ResetTokenUncheckedCreateInput.schema';

export const ResetTokenCreateOneSchema: z.ZodType<Prisma.ResetTokenCreateArgs> = z.object({ select: ResetTokenSelectObjectSchema.optional(),  data: z.union([ResetTokenCreateInputObjectSchema, ResetTokenUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.ResetTokenCreateArgs>;

export const ResetTokenCreateOneZodSchema = z.object({ select: ResetTokenSelectObjectSchema.optional(),  data: z.union([ResetTokenCreateInputObjectSchema, ResetTokenUncheckedCreateInputObjectSchema]) }).strict();
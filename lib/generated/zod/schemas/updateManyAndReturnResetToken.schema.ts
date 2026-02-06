import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { ResetTokenSelectObjectSchema as ResetTokenSelectObjectSchema } from './objects/ResetTokenSelect.schema';
import { ResetTokenUpdateManyMutationInputObjectSchema as ResetTokenUpdateManyMutationInputObjectSchema } from './objects/ResetTokenUpdateManyMutationInput.schema';
import { ResetTokenWhereInputObjectSchema as ResetTokenWhereInputObjectSchema } from './objects/ResetTokenWhereInput.schema';

export const ResetTokenUpdateManyAndReturnSchema: z.ZodType<Prisma.ResetTokenUpdateManyAndReturnArgs> = z.object({ select: ResetTokenSelectObjectSchema.optional(), data: ResetTokenUpdateManyMutationInputObjectSchema, where: ResetTokenWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.ResetTokenUpdateManyAndReturnArgs>;

export const ResetTokenUpdateManyAndReturnZodSchema = z.object({ select: ResetTokenSelectObjectSchema.optional(), data: ResetTokenUpdateManyMutationInputObjectSchema, where: ResetTokenWhereInputObjectSchema.optional() }).strict();
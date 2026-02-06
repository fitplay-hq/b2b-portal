import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { ResetTokenUpdateManyMutationInputObjectSchema as ResetTokenUpdateManyMutationInputObjectSchema } from './objects/ResetTokenUpdateManyMutationInput.schema';
import { ResetTokenWhereInputObjectSchema as ResetTokenWhereInputObjectSchema } from './objects/ResetTokenWhereInput.schema';

export const ResetTokenUpdateManySchema: z.ZodType<Prisma.ResetTokenUpdateManyArgs> = z.object({ data: ResetTokenUpdateManyMutationInputObjectSchema, where: ResetTokenWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.ResetTokenUpdateManyArgs>;

export const ResetTokenUpdateManyZodSchema = z.object({ data: ResetTokenUpdateManyMutationInputObjectSchema, where: ResetTokenWhereInputObjectSchema.optional() }).strict();
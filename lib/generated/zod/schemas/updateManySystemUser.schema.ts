import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { SystemUserUpdateManyMutationInputObjectSchema as SystemUserUpdateManyMutationInputObjectSchema } from './objects/SystemUserUpdateManyMutationInput.schema';
import { SystemUserWhereInputObjectSchema as SystemUserWhereInputObjectSchema } from './objects/SystemUserWhereInput.schema';

export const SystemUserUpdateManySchema: z.ZodType<Prisma.SystemUserUpdateManyArgs> = z.object({ data: SystemUserUpdateManyMutationInputObjectSchema, where: SystemUserWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.SystemUserUpdateManyArgs>;

export const SystemUserUpdateManyZodSchema = z.object({ data: SystemUserUpdateManyMutationInputObjectSchema, where: SystemUserWhereInputObjectSchema.optional() }).strict();
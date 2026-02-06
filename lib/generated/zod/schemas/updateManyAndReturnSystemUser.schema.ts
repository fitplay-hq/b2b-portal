import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { SystemUserSelectObjectSchema as SystemUserSelectObjectSchema } from './objects/SystemUserSelect.schema';
import { SystemUserUpdateManyMutationInputObjectSchema as SystemUserUpdateManyMutationInputObjectSchema } from './objects/SystemUserUpdateManyMutationInput.schema';
import { SystemUserWhereInputObjectSchema as SystemUserWhereInputObjectSchema } from './objects/SystemUserWhereInput.schema';

export const SystemUserUpdateManyAndReturnSchema: z.ZodType<Prisma.SystemUserUpdateManyAndReturnArgs> = z.object({ select: SystemUserSelectObjectSchema.optional(), data: SystemUserUpdateManyMutationInputObjectSchema, where: SystemUserWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.SystemUserUpdateManyAndReturnArgs>;

export const SystemUserUpdateManyAndReturnZodSchema = z.object({ select: SystemUserSelectObjectSchema.optional(), data: SystemUserUpdateManyMutationInputObjectSchema, where: SystemUserWhereInputObjectSchema.optional() }).strict();
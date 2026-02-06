import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { ClientSelectObjectSchema as ClientSelectObjectSchema } from './objects/ClientSelect.schema';
import { ClientUpdateManyMutationInputObjectSchema as ClientUpdateManyMutationInputObjectSchema } from './objects/ClientUpdateManyMutationInput.schema';
import { ClientWhereInputObjectSchema as ClientWhereInputObjectSchema } from './objects/ClientWhereInput.schema';

export const ClientUpdateManyAndReturnSchema: z.ZodType<Prisma.ClientUpdateManyAndReturnArgs> = z.object({ select: ClientSelectObjectSchema.optional(), data: ClientUpdateManyMutationInputObjectSchema, where: ClientWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.ClientUpdateManyAndReturnArgs>;

export const ClientUpdateManyAndReturnZodSchema = z.object({ select: ClientSelectObjectSchema.optional(), data: ClientUpdateManyMutationInputObjectSchema, where: ClientWhereInputObjectSchema.optional() }).strict();
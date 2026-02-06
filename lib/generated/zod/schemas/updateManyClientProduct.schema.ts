import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { ClientProductUpdateManyMutationInputObjectSchema as ClientProductUpdateManyMutationInputObjectSchema } from './objects/ClientProductUpdateManyMutationInput.schema';
import { ClientProductWhereInputObjectSchema as ClientProductWhereInputObjectSchema } from './objects/ClientProductWhereInput.schema';

export const ClientProductUpdateManySchema: z.ZodType<Prisma.ClientProductUpdateManyArgs> = z.object({ data: ClientProductUpdateManyMutationInputObjectSchema, where: ClientProductWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.ClientProductUpdateManyArgs>;

export const ClientProductUpdateManyZodSchema = z.object({ data: ClientProductUpdateManyMutationInputObjectSchema, where: ClientProductWhereInputObjectSchema.optional() }).strict();
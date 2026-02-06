import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { ClientProductSelectObjectSchema as ClientProductSelectObjectSchema } from './objects/ClientProductSelect.schema';
import { ClientProductUpdateManyMutationInputObjectSchema as ClientProductUpdateManyMutationInputObjectSchema } from './objects/ClientProductUpdateManyMutationInput.schema';
import { ClientProductWhereInputObjectSchema as ClientProductWhereInputObjectSchema } from './objects/ClientProductWhereInput.schema';

export const ClientProductUpdateManyAndReturnSchema: z.ZodType<Prisma.ClientProductUpdateManyAndReturnArgs> = z.object({ select: ClientProductSelectObjectSchema.optional(), data: ClientProductUpdateManyMutationInputObjectSchema, where: ClientProductWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.ClientProductUpdateManyAndReturnArgs>;

export const ClientProductUpdateManyAndReturnZodSchema = z.object({ select: ClientProductSelectObjectSchema.optional(), data: ClientProductUpdateManyMutationInputObjectSchema, where: ClientProductWhereInputObjectSchema.optional() }).strict();
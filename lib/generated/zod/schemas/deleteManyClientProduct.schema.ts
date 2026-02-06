import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { ClientProductWhereInputObjectSchema as ClientProductWhereInputObjectSchema } from './objects/ClientProductWhereInput.schema';

export const ClientProductDeleteManySchema: z.ZodType<Prisma.ClientProductDeleteManyArgs> = z.object({ where: ClientProductWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.ClientProductDeleteManyArgs>;

export const ClientProductDeleteManyZodSchema = z.object({ where: ClientProductWhereInputObjectSchema.optional() }).strict();
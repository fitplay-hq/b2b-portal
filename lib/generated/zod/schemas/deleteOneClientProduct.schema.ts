import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { ClientProductSelectObjectSchema as ClientProductSelectObjectSchema } from './objects/ClientProductSelect.schema';
import { ClientProductIncludeObjectSchema as ClientProductIncludeObjectSchema } from './objects/ClientProductInclude.schema';
import { ClientProductWhereUniqueInputObjectSchema as ClientProductWhereUniqueInputObjectSchema } from './objects/ClientProductWhereUniqueInput.schema';

export const ClientProductDeleteOneSchema: z.ZodType<Prisma.ClientProductDeleteArgs> = z.object({ select: ClientProductSelectObjectSchema.optional(), include: ClientProductIncludeObjectSchema.optional(), where: ClientProductWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.ClientProductDeleteArgs>;

export const ClientProductDeleteOneZodSchema = z.object({ select: ClientProductSelectObjectSchema.optional(), include: ClientProductIncludeObjectSchema.optional(), where: ClientProductWhereUniqueInputObjectSchema }).strict();
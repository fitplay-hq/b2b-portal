import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { ClientProductSelectObjectSchema as ClientProductSelectObjectSchema } from './objects/ClientProductSelect.schema';
import { ClientProductIncludeObjectSchema as ClientProductIncludeObjectSchema } from './objects/ClientProductInclude.schema';
import { ClientProductWhereUniqueInputObjectSchema as ClientProductWhereUniqueInputObjectSchema } from './objects/ClientProductWhereUniqueInput.schema';

export const ClientProductFindUniqueSchema: z.ZodType<Prisma.ClientProductFindUniqueArgs> = z.object({ select: ClientProductSelectObjectSchema.optional(), include: ClientProductIncludeObjectSchema.optional(), where: ClientProductWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.ClientProductFindUniqueArgs>;

export const ClientProductFindUniqueZodSchema = z.object({ select: ClientProductSelectObjectSchema.optional(), include: ClientProductIncludeObjectSchema.optional(), where: ClientProductWhereUniqueInputObjectSchema }).strict();
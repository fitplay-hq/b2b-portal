import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { ClientProductSelectObjectSchema as ClientProductSelectObjectSchema } from './objects/ClientProductSelect.schema';
import { ClientProductIncludeObjectSchema as ClientProductIncludeObjectSchema } from './objects/ClientProductInclude.schema';
import { ClientProductUpdateInputObjectSchema as ClientProductUpdateInputObjectSchema } from './objects/ClientProductUpdateInput.schema';
import { ClientProductUncheckedUpdateInputObjectSchema as ClientProductUncheckedUpdateInputObjectSchema } from './objects/ClientProductUncheckedUpdateInput.schema';
import { ClientProductWhereUniqueInputObjectSchema as ClientProductWhereUniqueInputObjectSchema } from './objects/ClientProductWhereUniqueInput.schema';

export const ClientProductUpdateOneSchema: z.ZodType<Prisma.ClientProductUpdateArgs> = z.object({ select: ClientProductSelectObjectSchema.optional(), include: ClientProductIncludeObjectSchema.optional(), data: z.union([ClientProductUpdateInputObjectSchema, ClientProductUncheckedUpdateInputObjectSchema]), where: ClientProductWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.ClientProductUpdateArgs>;

export const ClientProductUpdateOneZodSchema = z.object({ select: ClientProductSelectObjectSchema.optional(), include: ClientProductIncludeObjectSchema.optional(), data: z.union([ClientProductUpdateInputObjectSchema, ClientProductUncheckedUpdateInputObjectSchema]), where: ClientProductWhereUniqueInputObjectSchema }).strict();
import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { ClientProductSelectObjectSchema as ClientProductSelectObjectSchema } from './objects/ClientProductSelect.schema';
import { ClientProductIncludeObjectSchema as ClientProductIncludeObjectSchema } from './objects/ClientProductInclude.schema';
import { ClientProductWhereUniqueInputObjectSchema as ClientProductWhereUniqueInputObjectSchema } from './objects/ClientProductWhereUniqueInput.schema';
import { ClientProductCreateInputObjectSchema as ClientProductCreateInputObjectSchema } from './objects/ClientProductCreateInput.schema';
import { ClientProductUncheckedCreateInputObjectSchema as ClientProductUncheckedCreateInputObjectSchema } from './objects/ClientProductUncheckedCreateInput.schema';
import { ClientProductUpdateInputObjectSchema as ClientProductUpdateInputObjectSchema } from './objects/ClientProductUpdateInput.schema';
import { ClientProductUncheckedUpdateInputObjectSchema as ClientProductUncheckedUpdateInputObjectSchema } from './objects/ClientProductUncheckedUpdateInput.schema';

export const ClientProductUpsertOneSchema: z.ZodType<Prisma.ClientProductUpsertArgs> = z.object({ select: ClientProductSelectObjectSchema.optional(), include: ClientProductIncludeObjectSchema.optional(), where: ClientProductWhereUniqueInputObjectSchema, create: z.union([ ClientProductCreateInputObjectSchema, ClientProductUncheckedCreateInputObjectSchema ]), update: z.union([ ClientProductUpdateInputObjectSchema, ClientProductUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.ClientProductUpsertArgs>;

export const ClientProductUpsertOneZodSchema = z.object({ select: ClientProductSelectObjectSchema.optional(), include: ClientProductIncludeObjectSchema.optional(), where: ClientProductWhereUniqueInputObjectSchema, create: z.union([ ClientProductCreateInputObjectSchema, ClientProductUncheckedCreateInputObjectSchema ]), update: z.union([ ClientProductUpdateInputObjectSchema, ClientProductUncheckedUpdateInputObjectSchema ]) }).strict();
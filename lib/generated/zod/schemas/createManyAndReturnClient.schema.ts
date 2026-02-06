import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { ClientSelectObjectSchema as ClientSelectObjectSchema } from './objects/ClientSelect.schema';
import { ClientCreateManyInputObjectSchema as ClientCreateManyInputObjectSchema } from './objects/ClientCreateManyInput.schema';

export const ClientCreateManyAndReturnSchema: z.ZodType<Prisma.ClientCreateManyAndReturnArgs> = z.object({ select: ClientSelectObjectSchema.optional(), data: z.union([ ClientCreateManyInputObjectSchema, z.array(ClientCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.ClientCreateManyAndReturnArgs>;

export const ClientCreateManyAndReturnZodSchema = z.object({ select: ClientSelectObjectSchema.optional(), data: z.union([ ClientCreateManyInputObjectSchema, z.array(ClientCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();
import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { ClientProductSelectObjectSchema as ClientProductSelectObjectSchema } from './objects/ClientProductSelect.schema';
import { ClientProductCreateManyInputObjectSchema as ClientProductCreateManyInputObjectSchema } from './objects/ClientProductCreateManyInput.schema';

export const ClientProductCreateManyAndReturnSchema: z.ZodType<Prisma.ClientProductCreateManyAndReturnArgs> = z.object({ select: ClientProductSelectObjectSchema.optional(), data: z.union([ ClientProductCreateManyInputObjectSchema, z.array(ClientProductCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.ClientProductCreateManyAndReturnArgs>;

export const ClientProductCreateManyAndReturnZodSchema = z.object({ select: ClientProductSelectObjectSchema.optional(), data: z.union([ ClientProductCreateManyInputObjectSchema, z.array(ClientProductCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();
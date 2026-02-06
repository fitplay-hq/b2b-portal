import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { ClientProductCreateManyInputObjectSchema as ClientProductCreateManyInputObjectSchema } from './objects/ClientProductCreateManyInput.schema';

export const ClientProductCreateManySchema: z.ZodType<Prisma.ClientProductCreateManyArgs> = z.object({ data: z.union([ ClientProductCreateManyInputObjectSchema, z.array(ClientProductCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.ClientProductCreateManyArgs>;

export const ClientProductCreateManyZodSchema = z.object({ data: z.union([ ClientProductCreateManyInputObjectSchema, z.array(ClientProductCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();
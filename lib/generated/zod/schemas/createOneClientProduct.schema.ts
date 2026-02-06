import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { ClientProductSelectObjectSchema as ClientProductSelectObjectSchema } from './objects/ClientProductSelect.schema';
import { ClientProductIncludeObjectSchema as ClientProductIncludeObjectSchema } from './objects/ClientProductInclude.schema';
import { ClientProductCreateInputObjectSchema as ClientProductCreateInputObjectSchema } from './objects/ClientProductCreateInput.schema';
import { ClientProductUncheckedCreateInputObjectSchema as ClientProductUncheckedCreateInputObjectSchema } from './objects/ClientProductUncheckedCreateInput.schema';

export const ClientProductCreateOneSchema: z.ZodType<Prisma.ClientProductCreateArgs> = z.object({ select: ClientProductSelectObjectSchema.optional(), include: ClientProductIncludeObjectSchema.optional(), data: z.union([ClientProductCreateInputObjectSchema, ClientProductUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.ClientProductCreateArgs>;

export const ClientProductCreateOneZodSchema = z.object({ select: ClientProductSelectObjectSchema.optional(), include: ClientProductIncludeObjectSchema.optional(), data: z.union([ClientProductCreateInputObjectSchema, ClientProductUncheckedCreateInputObjectSchema]) }).strict();
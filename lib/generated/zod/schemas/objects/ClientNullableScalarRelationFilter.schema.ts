import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ClientWhereInputObjectSchema as ClientWhereInputObjectSchema } from './ClientWhereInput.schema'

const makeSchema = () => z.object({
  is: z.lazy(() => ClientWhereInputObjectSchema).optional().nullable(),
  isNot: z.lazy(() => ClientWhereInputObjectSchema).optional().nullable()
}).strict();
export const ClientNullableScalarRelationFilterObjectSchema: z.ZodType<Prisma.ClientNullableScalarRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.ClientNullableScalarRelationFilter>;
export const ClientNullableScalarRelationFilterObjectZodSchema = makeSchema();

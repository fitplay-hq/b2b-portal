import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ClientProductWhereInputObjectSchema as ClientProductWhereInputObjectSchema } from './ClientProductWhereInput.schema'

const makeSchema = () => z.object({
  every: z.lazy(() => ClientProductWhereInputObjectSchema).optional(),
  some: z.lazy(() => ClientProductWhereInputObjectSchema).optional(),
  none: z.lazy(() => ClientProductWhereInputObjectSchema).optional()
}).strict();
export const ClientProductListRelationFilterObjectSchema: z.ZodType<Prisma.ClientProductListRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.ClientProductListRelationFilter>;
export const ClientProductListRelationFilterObjectZodSchema = makeSchema();

import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ClientArgsObjectSchema as ClientArgsObjectSchema } from './ClientArgs.schema';
import { ProductArgsObjectSchema as ProductArgsObjectSchema } from './ProductArgs.schema'

const makeSchema = () => z.object({
  client: z.union([z.boolean(), z.lazy(() => ClientArgsObjectSchema)]).optional(),
  product: z.union([z.boolean(), z.lazy(() => ProductArgsObjectSchema)]).optional()
}).strict();
export const ClientProductIncludeObjectSchema: z.ZodType<Prisma.ClientProductInclude> = makeSchema() as unknown as z.ZodType<Prisma.ClientProductInclude>;
export const ClientProductIncludeObjectZodSchema = makeSchema();

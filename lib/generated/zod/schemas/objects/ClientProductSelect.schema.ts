import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ClientArgsObjectSchema as ClientArgsObjectSchema } from './ClientArgs.schema';
import { ProductArgsObjectSchema as ProductArgsObjectSchema } from './ProductArgs.schema'

const makeSchema = () => z.object({
  id: z.boolean().optional(),
  client: z.union([z.boolean(), z.lazy(() => ClientArgsObjectSchema)]).optional(),
  clientId: z.boolean().optional(),
  product: z.union([z.boolean(), z.lazy(() => ProductArgsObjectSchema)]).optional(),
  productId: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional()
}).strict();
export const ClientProductSelectObjectSchema: z.ZodType<Prisma.ClientProductSelect> = makeSchema() as unknown as z.ZodType<Prisma.ClientProductSelect>;
export const ClientProductSelectObjectZodSchema = makeSchema();

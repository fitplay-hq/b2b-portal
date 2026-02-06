import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { CompanyArgsObjectSchema as CompanyArgsObjectSchema } from './CompanyArgs.schema';
import { OrderFindManySchema as OrderFindManySchema } from '../findManyOrder.schema';
import { ClientProductFindManySchema as ClientProductFindManySchema } from '../findManyClientProduct.schema';
import { ClientCountOutputTypeArgsObjectSchema as ClientCountOutputTypeArgsObjectSchema } from './ClientCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  company: z.union([z.boolean(), z.lazy(() => CompanyArgsObjectSchema)]).optional(),
  orders: z.union([z.boolean(), z.lazy(() => OrderFindManySchema)]).optional(),
  products: z.union([z.boolean(), z.lazy(() => ClientProductFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => ClientCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const ClientIncludeObjectSchema: z.ZodType<Prisma.ClientInclude> = makeSchema() as unknown as z.ZodType<Prisma.ClientInclude>;
export const ClientIncludeObjectZodSchema = makeSchema();

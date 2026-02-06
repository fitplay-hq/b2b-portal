import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { CompanyArgsObjectSchema as CompanyArgsObjectSchema } from './CompanyArgs.schema';
import { OrderFindManySchema as OrderFindManySchema } from '../findManyOrder.schema';
import { ClientProductFindManySchema as ClientProductFindManySchema } from '../findManyClientProduct.schema';
import { ClientCountOutputTypeArgsObjectSchema as ClientCountOutputTypeArgsObjectSchema } from './ClientCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  email: z.boolean().optional(),
  password: z.boolean().optional(),
  phone: z.boolean().optional(),
  company: z.union([z.boolean(), z.lazy(() => CompanyArgsObjectSchema)]).optional(),
  companyID: z.boolean().optional(),
  companyName: z.boolean().optional(),
  isShowPrice: z.boolean().optional(),
  address: z.boolean().optional(),
  role: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  orders: z.union([z.boolean(), z.lazy(() => OrderFindManySchema)]).optional(),
  products: z.union([z.boolean(), z.lazy(() => ClientProductFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => ClientCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const ClientSelectObjectSchema: z.ZodType<Prisma.ClientSelect> = makeSchema() as unknown as z.ZodType<Prisma.ClientSelect>;
export const ClientSelectObjectZodSchema = makeSchema();

import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ProductFindManySchema as ProductFindManySchema } from '../findManyProduct.schema';
import { ClientFindManySchema as ClientFindManySchema } from '../findManyClient.schema';
import { CompanyCountOutputTypeArgsObjectSchema as CompanyCountOutputTypeArgsObjectSchema } from './CompanyCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  address: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  products: z.union([z.boolean(), z.lazy(() => ProductFindManySchema)]).optional(),
  clients: z.union([z.boolean(), z.lazy(() => ClientFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => CompanyCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const CompanySelectObjectSchema: z.ZodType<Prisma.CompanySelect> = makeSchema() as unknown as z.ZodType<Prisma.CompanySelect>;
export const CompanySelectObjectZodSchema = makeSchema();

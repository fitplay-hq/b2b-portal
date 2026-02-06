import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ProductFindManySchema as ProductFindManySchema } from '../findManyProduct.schema';
import { ClientFindManySchema as ClientFindManySchema } from '../findManyClient.schema';
import { CompanyCountOutputTypeArgsObjectSchema as CompanyCountOutputTypeArgsObjectSchema } from './CompanyCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  products: z.union([z.boolean(), z.lazy(() => ProductFindManySchema)]).optional(),
  clients: z.union([z.boolean(), z.lazy(() => ClientFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => CompanyCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const CompanyIncludeObjectSchema: z.ZodType<Prisma.CompanyInclude> = makeSchema() as unknown as z.ZodType<Prisma.CompanyInclude>;
export const CompanyIncludeObjectZodSchema = makeSchema();

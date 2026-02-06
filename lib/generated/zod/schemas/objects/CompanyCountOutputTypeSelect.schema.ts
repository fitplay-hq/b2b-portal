import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { CompanyCountOutputTypeCountProductsArgsObjectSchema as CompanyCountOutputTypeCountProductsArgsObjectSchema } from './CompanyCountOutputTypeCountProductsArgs.schema';
import { CompanyCountOutputTypeCountClientsArgsObjectSchema as CompanyCountOutputTypeCountClientsArgsObjectSchema } from './CompanyCountOutputTypeCountClientsArgs.schema'

const makeSchema = () => z.object({
  products: z.union([z.boolean(), z.lazy(() => CompanyCountOutputTypeCountProductsArgsObjectSchema)]).optional(),
  clients: z.union([z.boolean(), z.lazy(() => CompanyCountOutputTypeCountClientsArgsObjectSchema)]).optional()
}).strict();
export const CompanyCountOutputTypeSelectObjectSchema: z.ZodType<Prisma.CompanyCountOutputTypeSelect> = makeSchema() as unknown as z.ZodType<Prisma.CompanyCountOutputTypeSelect>;
export const CompanyCountOutputTypeSelectObjectZodSchema = makeSchema();

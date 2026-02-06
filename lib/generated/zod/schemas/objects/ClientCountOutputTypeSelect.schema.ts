import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ClientCountOutputTypeCountOrdersArgsObjectSchema as ClientCountOutputTypeCountOrdersArgsObjectSchema } from './ClientCountOutputTypeCountOrdersArgs.schema';
import { ClientCountOutputTypeCountProductsArgsObjectSchema as ClientCountOutputTypeCountProductsArgsObjectSchema } from './ClientCountOutputTypeCountProductsArgs.schema'

const makeSchema = () => z.object({
  orders: z.union([z.boolean(), z.lazy(() => ClientCountOutputTypeCountOrdersArgsObjectSchema)]).optional(),
  products: z.union([z.boolean(), z.lazy(() => ClientCountOutputTypeCountProductsArgsObjectSchema)]).optional()
}).strict();
export const ClientCountOutputTypeSelectObjectSchema: z.ZodType<Prisma.ClientCountOutputTypeSelect> = makeSchema() as unknown as z.ZodType<Prisma.ClientCountOutputTypeSelect>;
export const ClientCountOutputTypeSelectObjectZodSchema = makeSchema();

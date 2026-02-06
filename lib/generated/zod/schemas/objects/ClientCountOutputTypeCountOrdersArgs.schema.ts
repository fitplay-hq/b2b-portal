import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { OrderWhereInputObjectSchema as OrderWhereInputObjectSchema } from './OrderWhereInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => OrderWhereInputObjectSchema).optional()
}).strict();
export const ClientCountOutputTypeCountOrdersArgsObjectSchema = makeSchema();
export const ClientCountOutputTypeCountOrdersArgsObjectZodSchema = makeSchema();

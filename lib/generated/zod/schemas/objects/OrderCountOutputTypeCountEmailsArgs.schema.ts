import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { OrderEmailWhereInputObjectSchema as OrderEmailWhereInputObjectSchema } from './OrderEmailWhereInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => OrderEmailWhereInputObjectSchema).optional()
}).strict();
export const OrderCountOutputTypeCountEmailsArgsObjectSchema = makeSchema();
export const OrderCountOutputTypeCountEmailsArgsObjectZodSchema = makeSchema();

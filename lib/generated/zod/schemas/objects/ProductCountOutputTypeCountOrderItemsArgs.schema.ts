import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { OrderItemWhereInputObjectSchema as OrderItemWhereInputObjectSchema } from './OrderItemWhereInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => OrderItemWhereInputObjectSchema).optional()
}).strict();
export const ProductCountOutputTypeCountOrderItemsArgsObjectSchema = makeSchema();
export const ProductCountOutputTypeCountOrderItemsArgsObjectZodSchema = makeSchema();

import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { BundleOrderItemWhereInputObjectSchema as BundleOrderItemWhereInputObjectSchema } from './BundleOrderItemWhereInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => BundleOrderItemWhereInputObjectSchema).optional()
}).strict();
export const ProductCountOutputTypeCountBundleOrderItemsArgsObjectSchema = makeSchema();
export const ProductCountOutputTypeCountBundleOrderItemsArgsObjectZodSchema = makeSchema();

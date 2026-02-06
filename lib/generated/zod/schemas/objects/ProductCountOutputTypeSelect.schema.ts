import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ProductCountOutputTypeCountCompaniesArgsObjectSchema as ProductCountOutputTypeCountCompaniesArgsObjectSchema } from './ProductCountOutputTypeCountCompaniesArgs.schema';
import { ProductCountOutputTypeCountClientsArgsObjectSchema as ProductCountOutputTypeCountClientsArgsObjectSchema } from './ProductCountOutputTypeCountClientsArgs.schema';
import { ProductCountOutputTypeCountOrderItemsArgsObjectSchema as ProductCountOutputTypeCountOrderItemsArgsObjectSchema } from './ProductCountOutputTypeCountOrderItemsArgs.schema';
import { ProductCountOutputTypeCountBundleOrderItemsArgsObjectSchema as ProductCountOutputTypeCountBundleOrderItemsArgsObjectSchema } from './ProductCountOutputTypeCountBundleOrderItemsArgs.schema';
import { ProductCountOutputTypeCountBundleItemsArgsObjectSchema as ProductCountOutputTypeCountBundleItemsArgsObjectSchema } from './ProductCountOutputTypeCountBundleItemsArgs.schema'

const makeSchema = () => z.object({
  companies: z.union([z.boolean(), z.lazy(() => ProductCountOutputTypeCountCompaniesArgsObjectSchema)]).optional(),
  clients: z.union([z.boolean(), z.lazy(() => ProductCountOutputTypeCountClientsArgsObjectSchema)]).optional(),
  orderItems: z.union([z.boolean(), z.lazy(() => ProductCountOutputTypeCountOrderItemsArgsObjectSchema)]).optional(),
  bundleOrderItems: z.union([z.boolean(), z.lazy(() => ProductCountOutputTypeCountBundleOrderItemsArgsObjectSchema)]).optional(),
  bundleItems: z.union([z.boolean(), z.lazy(() => ProductCountOutputTypeCountBundleItemsArgsObjectSchema)]).optional()
}).strict();
export const ProductCountOutputTypeSelectObjectSchema: z.ZodType<Prisma.ProductCountOutputTypeSelect> = makeSchema() as unknown as z.ZodType<Prisma.ProductCountOutputTypeSelect>;
export const ProductCountOutputTypeSelectObjectZodSchema = makeSchema();

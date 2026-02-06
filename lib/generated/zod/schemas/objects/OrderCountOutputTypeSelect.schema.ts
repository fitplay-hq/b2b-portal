import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { OrderCountOutputTypeCountOrderItemsArgsObjectSchema as OrderCountOutputTypeCountOrderItemsArgsObjectSchema } from './OrderCountOutputTypeCountOrderItemsArgs.schema';
import { OrderCountOutputTypeCountEmailsArgsObjectSchema as OrderCountOutputTypeCountEmailsArgsObjectSchema } from './OrderCountOutputTypeCountEmailsArgs.schema';
import { OrderCountOutputTypeCountBundleOrderItemsArgsObjectSchema as OrderCountOutputTypeCountBundleOrderItemsArgsObjectSchema } from './OrderCountOutputTypeCountBundleOrderItemsArgs.schema';
import { OrderCountOutputTypeCountBundlesArgsObjectSchema as OrderCountOutputTypeCountBundlesArgsObjectSchema } from './OrderCountOutputTypeCountBundlesArgs.schema'

const makeSchema = () => z.object({
  orderItems: z.union([z.boolean(), z.lazy(() => OrderCountOutputTypeCountOrderItemsArgsObjectSchema)]).optional(),
  emails: z.union([z.boolean(), z.lazy(() => OrderCountOutputTypeCountEmailsArgsObjectSchema)]).optional(),
  bundleOrderItems: z.union([z.boolean(), z.lazy(() => OrderCountOutputTypeCountBundleOrderItemsArgsObjectSchema)]).optional(),
  bundles: z.union([z.boolean(), z.lazy(() => OrderCountOutputTypeCountBundlesArgsObjectSchema)]).optional()
}).strict();
export const OrderCountOutputTypeSelectObjectSchema: z.ZodType<Prisma.OrderCountOutputTypeSelect> = makeSchema() as unknown as z.ZodType<Prisma.OrderCountOutputTypeSelect>;
export const OrderCountOutputTypeSelectObjectZodSchema = makeSchema();

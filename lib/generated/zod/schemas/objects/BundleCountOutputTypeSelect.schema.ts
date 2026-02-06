import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { BundleCountOutputTypeCountItemsArgsObjectSchema as BundleCountOutputTypeCountItemsArgsObjectSchema } from './BundleCountOutputTypeCountItemsArgs.schema';
import { BundleCountOutputTypeCountBundleOrderItemsArgsObjectSchema as BundleCountOutputTypeCountBundleOrderItemsArgsObjectSchema } from './BundleCountOutputTypeCountBundleOrderItemsArgs.schema'

const makeSchema = () => z.object({
  items: z.union([z.boolean(), z.lazy(() => BundleCountOutputTypeCountItemsArgsObjectSchema)]).optional(),
  bundleOrderItems: z.union([z.boolean(), z.lazy(() => BundleCountOutputTypeCountBundleOrderItemsArgsObjectSchema)]).optional()
}).strict();
export const BundleCountOutputTypeSelectObjectSchema: z.ZodType<Prisma.BundleCountOutputTypeSelect> = makeSchema() as unknown as z.ZodType<Prisma.BundleCountOutputTypeSelect>;
export const BundleCountOutputTypeSelectObjectZodSchema = makeSchema();

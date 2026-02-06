import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { BundleOrderItemCountOutputTypeCountBundleItemsArgsObjectSchema as BundleOrderItemCountOutputTypeCountBundleItemsArgsObjectSchema } from './BundleOrderItemCountOutputTypeCountBundleItemsArgs.schema'

const makeSchema = () => z.object({
  bundleItems: z.union([z.boolean(), z.lazy(() => BundleOrderItemCountOutputTypeCountBundleItemsArgsObjectSchema)]).optional()
}).strict();
export const BundleOrderItemCountOutputTypeSelectObjectSchema: z.ZodType<Prisma.BundleOrderItemCountOutputTypeSelect> = makeSchema() as unknown as z.ZodType<Prisma.BundleOrderItemCountOutputTypeSelect>;
export const BundleOrderItemCountOutputTypeSelectObjectZodSchema = makeSchema();

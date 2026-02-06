import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { BundleItemCountOutputTypeCountBundleOrderItemsArgsObjectSchema as BundleItemCountOutputTypeCountBundleOrderItemsArgsObjectSchema } from './BundleItemCountOutputTypeCountBundleOrderItemsArgs.schema'

const makeSchema = () => z.object({
  bundleOrderItems: z.union([z.boolean(), z.lazy(() => BundleItemCountOutputTypeCountBundleOrderItemsArgsObjectSchema)]).optional()
}).strict();
export const BundleItemCountOutputTypeSelectObjectSchema: z.ZodType<Prisma.BundleItemCountOutputTypeSelect> = makeSchema() as unknown as z.ZodType<Prisma.BundleItemCountOutputTypeSelect>;
export const BundleItemCountOutputTypeSelectObjectZodSchema = makeSchema();

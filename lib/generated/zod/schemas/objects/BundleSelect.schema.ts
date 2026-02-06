import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { OrderArgsObjectSchema as OrderArgsObjectSchema } from './OrderArgs.schema';
import { BundleItemFindManySchema as BundleItemFindManySchema } from '../findManyBundleItem.schema';
import { BundleOrderItemFindManySchema as BundleOrderItemFindManySchema } from '../findManyBundleOrderItem.schema';
import { BundleCountOutputTypeArgsObjectSchema as BundleCountOutputTypeArgsObjectSchema } from './BundleCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  id: z.boolean().optional(),
  orderId: z.boolean().optional(),
  order: z.union([z.boolean(), z.lazy(() => OrderArgsObjectSchema)]).optional(),
  price: z.boolean().optional(),
  numberOfBundles: z.boolean().optional(),
  items: z.union([z.boolean(), z.lazy(() => BundleItemFindManySchema)]).optional(),
  bundleOrderItems: z.union([z.boolean(), z.lazy(() => BundleOrderItemFindManySchema)]).optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  _count: z.union([z.boolean(), z.lazy(() => BundleCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const BundleSelectObjectSchema: z.ZodType<Prisma.BundleSelect> = makeSchema() as unknown as z.ZodType<Prisma.BundleSelect>;
export const BundleSelectObjectZodSchema = makeSchema();

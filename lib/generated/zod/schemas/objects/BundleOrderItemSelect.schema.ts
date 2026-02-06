import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { BundleArgsObjectSchema as BundleArgsObjectSchema } from './BundleArgs.schema';
import { OrderArgsObjectSchema as OrderArgsObjectSchema } from './OrderArgs.schema';
import { ProductArgsObjectSchema as ProductArgsObjectSchema } from './ProductArgs.schema';
import { BundleItemFindManySchema as BundleItemFindManySchema } from '../findManyBundleItem.schema';
import { BundleOrderItemCountOutputTypeArgsObjectSchema as BundleOrderItemCountOutputTypeArgsObjectSchema } from './BundleOrderItemCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  id: z.boolean().optional(),
  bundleId: z.boolean().optional(),
  bundle: z.union([z.boolean(), z.lazy(() => BundleArgsObjectSchema)]).optional(),
  order: z.union([z.boolean(), z.lazy(() => OrderArgsObjectSchema)]).optional(),
  orderId: z.boolean().optional(),
  product: z.union([z.boolean(), z.lazy(() => ProductArgsObjectSchema)]).optional(),
  productId: z.boolean().optional(),
  quantity: z.boolean().optional(),
  price: z.boolean().optional(),
  bundleItems: z.union([z.boolean(), z.lazy(() => BundleItemFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => BundleOrderItemCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const BundleOrderItemSelectObjectSchema: z.ZodType<Prisma.BundleOrderItemSelect> = makeSchema() as unknown as z.ZodType<Prisma.BundleOrderItemSelect>;
export const BundleOrderItemSelectObjectZodSchema = makeSchema();

import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { BundleArgsObjectSchema as BundleArgsObjectSchema } from './BundleArgs.schema';
import { ProductArgsObjectSchema as ProductArgsObjectSchema } from './ProductArgs.schema';
import { BundleOrderItemFindManySchema as BundleOrderItemFindManySchema } from '../findManyBundleOrderItem.schema';
import { BundleItemCountOutputTypeArgsObjectSchema as BundleItemCountOutputTypeArgsObjectSchema } from './BundleItemCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  id: z.boolean().optional(),
  bundleId: z.boolean().optional(),
  bundle: z.union([z.boolean(), z.lazy(() => BundleArgsObjectSchema)]).optional(),
  product: z.union([z.boolean(), z.lazy(() => ProductArgsObjectSchema)]).optional(),
  productId: z.boolean().optional(),
  bundleProductQuantity: z.boolean().optional(),
  price: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  bundleOrderItems: z.union([z.boolean(), z.lazy(() => BundleOrderItemFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => BundleItemCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const BundleItemSelectObjectSchema: z.ZodType<Prisma.BundleItemSelect> = makeSchema() as unknown as z.ZodType<Prisma.BundleItemSelect>;
export const BundleItemSelectObjectZodSchema = makeSchema();

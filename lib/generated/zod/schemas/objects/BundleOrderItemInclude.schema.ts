import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { BundleArgsObjectSchema as BundleArgsObjectSchema } from './BundleArgs.schema';
import { OrderArgsObjectSchema as OrderArgsObjectSchema } from './OrderArgs.schema';
import { ProductArgsObjectSchema as ProductArgsObjectSchema } from './ProductArgs.schema';
import { BundleItemFindManySchema as BundleItemFindManySchema } from '../findManyBundleItem.schema';
import { BundleOrderItemCountOutputTypeArgsObjectSchema as BundleOrderItemCountOutputTypeArgsObjectSchema } from './BundleOrderItemCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  bundle: z.union([z.boolean(), z.lazy(() => BundleArgsObjectSchema)]).optional(),
  order: z.union([z.boolean(), z.lazy(() => OrderArgsObjectSchema)]).optional(),
  product: z.union([z.boolean(), z.lazy(() => ProductArgsObjectSchema)]).optional(),
  bundleItems: z.union([z.boolean(), z.lazy(() => BundleItemFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => BundleOrderItemCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const BundleOrderItemIncludeObjectSchema: z.ZodType<Prisma.BundleOrderItemInclude> = makeSchema() as unknown as z.ZodType<Prisma.BundleOrderItemInclude>;
export const BundleOrderItemIncludeObjectZodSchema = makeSchema();

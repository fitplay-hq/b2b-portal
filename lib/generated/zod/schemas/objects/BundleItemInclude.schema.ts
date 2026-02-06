import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { BundleArgsObjectSchema as BundleArgsObjectSchema } from './BundleArgs.schema';
import { ProductArgsObjectSchema as ProductArgsObjectSchema } from './ProductArgs.schema';
import { BundleOrderItemFindManySchema as BundleOrderItemFindManySchema } from '../findManyBundleOrderItem.schema';
import { BundleItemCountOutputTypeArgsObjectSchema as BundleItemCountOutputTypeArgsObjectSchema } from './BundleItemCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  bundle: z.union([z.boolean(), z.lazy(() => BundleArgsObjectSchema)]).optional(),
  product: z.union([z.boolean(), z.lazy(() => ProductArgsObjectSchema)]).optional(),
  bundleOrderItems: z.union([z.boolean(), z.lazy(() => BundleOrderItemFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => BundleItemCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const BundleItemIncludeObjectSchema: z.ZodType<Prisma.BundleItemInclude> = makeSchema() as unknown as z.ZodType<Prisma.BundleItemInclude>;
export const BundleItemIncludeObjectZodSchema = makeSchema();

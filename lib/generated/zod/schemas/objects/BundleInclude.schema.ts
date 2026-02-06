import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { OrderArgsObjectSchema as OrderArgsObjectSchema } from './OrderArgs.schema';
import { BundleItemFindManySchema as BundleItemFindManySchema } from '../findManyBundleItem.schema';
import { BundleOrderItemFindManySchema as BundleOrderItemFindManySchema } from '../findManyBundleOrderItem.schema';
import { BundleCountOutputTypeArgsObjectSchema as BundleCountOutputTypeArgsObjectSchema } from './BundleCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  order: z.union([z.boolean(), z.lazy(() => OrderArgsObjectSchema)]).optional(),
  items: z.union([z.boolean(), z.lazy(() => BundleItemFindManySchema)]).optional(),
  bundleOrderItems: z.union([z.boolean(), z.lazy(() => BundleOrderItemFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => BundleCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const BundleIncludeObjectSchema: z.ZodType<Prisma.BundleInclude> = makeSchema() as unknown as z.ZodType<Prisma.BundleInclude>;
export const BundleIncludeObjectZodSchema = makeSchema();

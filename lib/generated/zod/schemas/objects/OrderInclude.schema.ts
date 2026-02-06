import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ClientArgsObjectSchema as ClientArgsObjectSchema } from './ClientArgs.schema';
import { OrderItemFindManySchema as OrderItemFindManySchema } from '../findManyOrderItem.schema';
import { OrderEmailFindManySchema as OrderEmailFindManySchema } from '../findManyOrderEmail.schema';
import { BundleOrderItemFindManySchema as BundleOrderItemFindManySchema } from '../findManyBundleOrderItem.schema';
import { BundleFindManySchema as BundleFindManySchema } from '../findManyBundle.schema';
import { OrderCountOutputTypeArgsObjectSchema as OrderCountOutputTypeArgsObjectSchema } from './OrderCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  client: z.union([z.boolean(), z.lazy(() => ClientArgsObjectSchema)]).optional(),
  orderItems: z.union([z.boolean(), z.lazy(() => OrderItemFindManySchema)]).optional(),
  emails: z.union([z.boolean(), z.lazy(() => OrderEmailFindManySchema)]).optional(),
  bundleOrderItems: z.union([z.boolean(), z.lazy(() => BundleOrderItemFindManySchema)]).optional(),
  bundles: z.union([z.boolean(), z.lazy(() => BundleFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => OrderCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const OrderIncludeObjectSchema: z.ZodType<Prisma.OrderInclude> = makeSchema() as unknown as z.ZodType<Prisma.OrderInclude>;
export const OrderIncludeObjectZodSchema = makeSchema();

import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ClientArgsObjectSchema as ClientArgsObjectSchema } from './ClientArgs.schema';
import { OrderItemFindManySchema as OrderItemFindManySchema } from '../findManyOrderItem.schema';
import { OrderEmailFindManySchema as OrderEmailFindManySchema } from '../findManyOrderEmail.schema';
import { BundleOrderItemFindManySchema as BundleOrderItemFindManySchema } from '../findManyBundleOrderItem.schema';
import { BundleFindManySchema as BundleFindManySchema } from '../findManyBundle.schema';
import { OrderCountOutputTypeArgsObjectSchema as OrderCountOutputTypeArgsObjectSchema } from './OrderCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  id: z.boolean().optional(),
  totalAmount: z.boolean().optional(),
  consigneeName: z.boolean().optional(),
  consigneePhone: z.boolean().optional(),
  consigneeEmail: z.boolean().optional(),
  consignmentNumber: z.boolean().optional(),
  deliveryService: z.boolean().optional(),
  deliveryAddress: z.boolean().optional(),
  city: z.boolean().optional(),
  state: z.boolean().optional(),
  pincode: z.boolean().optional(),
  modeOfDelivery: z.boolean().optional(),
  requiredByDate: z.boolean().optional(),
  deliveryReference: z.boolean().optional(),
  packagingInstructions: z.boolean().optional(),
  note: z.boolean().optional(),
  shippingLabelUrl: z.boolean().optional(),
  isMailSent: z.boolean().optional(),
  status: z.boolean().optional(),
  client: z.union([z.boolean(), z.lazy(() => ClientArgsObjectSchema)]).optional(),
  clientId: z.boolean().optional(),
  orderItems: z.union([z.boolean(), z.lazy(() => OrderItemFindManySchema)]).optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  emails: z.union([z.boolean(), z.lazy(() => OrderEmailFindManySchema)]).optional(),
  bundleOrderItems: z.union([z.boolean(), z.lazy(() => BundleOrderItemFindManySchema)]).optional(),
  bundles: z.union([z.boolean(), z.lazy(() => BundleFindManySchema)]).optional(),
  numberOfBundles: z.boolean().optional(),
  _count: z.union([z.boolean(), z.lazy(() => OrderCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const OrderSelectObjectSchema: z.ZodType<Prisma.OrderSelect> = makeSchema() as unknown as z.ZodType<Prisma.OrderSelect>;
export const OrderSelectObjectZodSchema = makeSchema();

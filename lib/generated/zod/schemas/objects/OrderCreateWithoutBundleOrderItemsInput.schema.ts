import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ModesSchema } from '../enums/Modes.schema';
import { StatusSchema } from '../enums/Status.schema';
import { ClientCreateNestedOneWithoutOrdersInputObjectSchema as ClientCreateNestedOneWithoutOrdersInputObjectSchema } from './ClientCreateNestedOneWithoutOrdersInput.schema';
import { OrderItemCreateNestedManyWithoutOrderInputObjectSchema as OrderItemCreateNestedManyWithoutOrderInputObjectSchema } from './OrderItemCreateNestedManyWithoutOrderInput.schema';
import { OrderEmailCreateNestedManyWithoutOrderInputObjectSchema as OrderEmailCreateNestedManyWithoutOrderInputObjectSchema } from './OrderEmailCreateNestedManyWithoutOrderInput.schema';
import { BundleCreateNestedManyWithoutOrderInputObjectSchema as BundleCreateNestedManyWithoutOrderInputObjectSchema } from './BundleCreateNestedManyWithoutOrderInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  totalAmount: z.number(),
  consigneeName: z.string().optional(),
  consigneePhone: z.string().optional(),
  consigneeEmail: z.string().optional(),
  consignmentNumber: z.string().optional().nullable(),
  deliveryService: z.string().optional().nullable(),
  deliveryAddress: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),
  modeOfDelivery: ModesSchema.optional(),
  requiredByDate: z.coerce.date(),
  deliveryReference: z.string().optional().nullable(),
  packagingInstructions: z.string().optional().nullable(),
  note: z.string().optional().nullable(),
  shippingLabelUrl: z.string().optional().nullable(),
  isMailSent: z.boolean().optional(),
  status: StatusSchema.optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  numberOfBundles: z.number().int().optional().nullable(),
  client: z.lazy(() => ClientCreateNestedOneWithoutOrdersInputObjectSchema).optional(),
  orderItems: z.lazy(() => OrderItemCreateNestedManyWithoutOrderInputObjectSchema).optional(),
  emails: z.lazy(() => OrderEmailCreateNestedManyWithoutOrderInputObjectSchema).optional(),
  bundles: z.lazy(() => BundleCreateNestedManyWithoutOrderInputObjectSchema).optional()
}).strict();
export const OrderCreateWithoutBundleOrderItemsInputObjectSchema: z.ZodType<Prisma.OrderCreateWithoutBundleOrderItemsInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderCreateWithoutBundleOrderItemsInput>;
export const OrderCreateWithoutBundleOrderItemsInputObjectZodSchema = makeSchema();

import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ModesSchema } from '../enums/Modes.schema';
import { StatusSchema } from '../enums/Status.schema';
import { OrderEmailUncheckedCreateNestedManyWithoutOrderInputObjectSchema as OrderEmailUncheckedCreateNestedManyWithoutOrderInputObjectSchema } from './OrderEmailUncheckedCreateNestedManyWithoutOrderInput.schema';
import { BundleOrderItemUncheckedCreateNestedManyWithoutOrderInputObjectSchema as BundleOrderItemUncheckedCreateNestedManyWithoutOrderInputObjectSchema } from './BundleOrderItemUncheckedCreateNestedManyWithoutOrderInput.schema';
import { BundleUncheckedCreateNestedManyWithoutOrderInputObjectSchema as BundleUncheckedCreateNestedManyWithoutOrderInputObjectSchema } from './BundleUncheckedCreateNestedManyWithoutOrderInput.schema'

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
  clientId: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  numberOfBundles: z.number().int().optional().nullable(),
  emails: z.lazy(() => OrderEmailUncheckedCreateNestedManyWithoutOrderInputObjectSchema).optional(),
  bundleOrderItems: z.lazy(() => BundleOrderItemUncheckedCreateNestedManyWithoutOrderInputObjectSchema).optional(),
  bundles: z.lazy(() => BundleUncheckedCreateNestedManyWithoutOrderInputObjectSchema).optional()
}).strict();
export const OrderUncheckedCreateWithoutOrderItemsInputObjectSchema: z.ZodType<Prisma.OrderUncheckedCreateWithoutOrderItemsInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderUncheckedCreateWithoutOrderItemsInput>;
export const OrderUncheckedCreateWithoutOrderItemsInputObjectZodSchema = makeSchema();

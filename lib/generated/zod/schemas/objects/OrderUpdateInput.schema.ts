import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { FloatFieldUpdateOperationsInputObjectSchema as FloatFieldUpdateOperationsInputObjectSchema } from './FloatFieldUpdateOperationsInput.schema';
import { NullableStringFieldUpdateOperationsInputObjectSchema as NullableStringFieldUpdateOperationsInputObjectSchema } from './NullableStringFieldUpdateOperationsInput.schema';
import { ModesSchema } from '../enums/Modes.schema';
import { EnumModesFieldUpdateOperationsInputObjectSchema as EnumModesFieldUpdateOperationsInputObjectSchema } from './EnumModesFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { BoolFieldUpdateOperationsInputObjectSchema as BoolFieldUpdateOperationsInputObjectSchema } from './BoolFieldUpdateOperationsInput.schema';
import { StatusSchema } from '../enums/Status.schema';
import { EnumStatusFieldUpdateOperationsInputObjectSchema as EnumStatusFieldUpdateOperationsInputObjectSchema } from './EnumStatusFieldUpdateOperationsInput.schema';
import { NullableIntFieldUpdateOperationsInputObjectSchema as NullableIntFieldUpdateOperationsInputObjectSchema } from './NullableIntFieldUpdateOperationsInput.schema';
import { ClientUpdateOneWithoutOrdersNestedInputObjectSchema as ClientUpdateOneWithoutOrdersNestedInputObjectSchema } from './ClientUpdateOneWithoutOrdersNestedInput.schema';
import { OrderItemUpdateManyWithoutOrderNestedInputObjectSchema as OrderItemUpdateManyWithoutOrderNestedInputObjectSchema } from './OrderItemUpdateManyWithoutOrderNestedInput.schema';
import { OrderEmailUpdateManyWithoutOrderNestedInputObjectSchema as OrderEmailUpdateManyWithoutOrderNestedInputObjectSchema } from './OrderEmailUpdateManyWithoutOrderNestedInput.schema';
import { BundleOrderItemUpdateManyWithoutOrderNestedInputObjectSchema as BundleOrderItemUpdateManyWithoutOrderNestedInputObjectSchema } from './BundleOrderItemUpdateManyWithoutOrderNestedInput.schema';
import { BundleUpdateManyWithoutOrderNestedInputObjectSchema as BundleUpdateManyWithoutOrderNestedInputObjectSchema } from './BundleUpdateManyWithoutOrderNestedInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  totalAmount: z.union([z.number(), z.lazy(() => FloatFieldUpdateOperationsInputObjectSchema)]).optional(),
  consigneeName: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  consigneePhone: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  consigneeEmail: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  consignmentNumber: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  deliveryService: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  deliveryAddress: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  city: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  state: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  pincode: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  modeOfDelivery: z.union([ModesSchema, z.lazy(() => EnumModesFieldUpdateOperationsInputObjectSchema)]).optional(),
  requiredByDate: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  deliveryReference: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  packagingInstructions: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  note: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  shippingLabelUrl: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  isMailSent: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputObjectSchema)]).optional(),
  status: z.union([StatusSchema, z.lazy(() => EnumStatusFieldUpdateOperationsInputObjectSchema)]).optional(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  updatedAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  numberOfBundles: z.union([z.number().int(), z.lazy(() => NullableIntFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  client: z.lazy(() => ClientUpdateOneWithoutOrdersNestedInputObjectSchema).optional(),
  orderItems: z.lazy(() => OrderItemUpdateManyWithoutOrderNestedInputObjectSchema).optional(),
  emails: z.lazy(() => OrderEmailUpdateManyWithoutOrderNestedInputObjectSchema).optional(),
  bundleOrderItems: z.lazy(() => BundleOrderItemUpdateManyWithoutOrderNestedInputObjectSchema).optional(),
  bundles: z.lazy(() => BundleUpdateManyWithoutOrderNestedInputObjectSchema).optional()
}).strict();
export const OrderUpdateInputObjectSchema: z.ZodType<Prisma.OrderUpdateInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderUpdateInput>;
export const OrderUpdateInputObjectZodSchema = makeSchema();

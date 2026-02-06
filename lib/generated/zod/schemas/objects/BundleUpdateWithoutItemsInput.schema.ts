import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { NullableFloatFieldUpdateOperationsInputObjectSchema as NullableFloatFieldUpdateOperationsInputObjectSchema } from './NullableFloatFieldUpdateOperationsInput.schema';
import { NullableIntFieldUpdateOperationsInputObjectSchema as NullableIntFieldUpdateOperationsInputObjectSchema } from './NullableIntFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { OrderUpdateOneWithoutBundlesNestedInputObjectSchema as OrderUpdateOneWithoutBundlesNestedInputObjectSchema } from './OrderUpdateOneWithoutBundlesNestedInput.schema';
import { BundleOrderItemUpdateManyWithoutBundleNestedInputObjectSchema as BundleOrderItemUpdateManyWithoutBundleNestedInputObjectSchema } from './BundleOrderItemUpdateManyWithoutBundleNestedInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  price: z.union([z.number(), z.lazy(() => NullableFloatFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  numberOfBundles: z.union([z.number().int(), z.lazy(() => NullableIntFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  updatedAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  order: z.lazy(() => OrderUpdateOneWithoutBundlesNestedInputObjectSchema).optional(),
  bundleOrderItems: z.lazy(() => BundleOrderItemUpdateManyWithoutBundleNestedInputObjectSchema).optional()
}).strict();
export const BundleUpdateWithoutItemsInputObjectSchema: z.ZodType<Prisma.BundleUpdateWithoutItemsInput> = makeSchema() as unknown as z.ZodType<Prisma.BundleUpdateWithoutItemsInput>;
export const BundleUpdateWithoutItemsInputObjectZodSchema = makeSchema();

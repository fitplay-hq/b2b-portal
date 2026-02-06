import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { StatusSchema } from '../enums/Status.schema';
import { EnumStatusFieldUpdateOperationsInputObjectSchema as EnumStatusFieldUpdateOperationsInputObjectSchema } from './EnumStatusFieldUpdateOperationsInput.schema';
import { BoolFieldUpdateOperationsInputObjectSchema as BoolFieldUpdateOperationsInputObjectSchema } from './BoolFieldUpdateOperationsInput.schema';
import { NullableDateTimeFieldUpdateOperationsInputObjectSchema as NullableDateTimeFieldUpdateOperationsInputObjectSchema } from './NullableDateTimeFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { OrderUpdateOneRequiredWithoutEmailsNestedInputObjectSchema as OrderUpdateOneRequiredWithoutEmailsNestedInputObjectSchema } from './OrderUpdateOneRequiredWithoutEmailsNestedInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  purpose: z.union([StatusSchema, z.lazy(() => EnumStatusFieldUpdateOperationsInputObjectSchema)]).optional(),
  isSent: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputObjectSchema)]).optional(),
  sentAt: z.union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputObjectSchema)]).optional().nullable(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  updatedAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  order: z.lazy(() => OrderUpdateOneRequiredWithoutEmailsNestedInputObjectSchema).optional()
}).strict();
export const OrderEmailUpdateInputObjectSchema: z.ZodType<Prisma.OrderEmailUpdateInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderEmailUpdateInput>;
export const OrderEmailUpdateInputObjectZodSchema = makeSchema();

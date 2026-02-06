import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { ClientUpdateOneRequiredWithoutProductsNestedInputObjectSchema as ClientUpdateOneRequiredWithoutProductsNestedInputObjectSchema } from './ClientUpdateOneRequiredWithoutProductsNestedInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  updatedAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  client: z.lazy(() => ClientUpdateOneRequiredWithoutProductsNestedInputObjectSchema).optional()
}).strict();
export const ClientProductUpdateWithoutProductInputObjectSchema: z.ZodType<Prisma.ClientProductUpdateWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.ClientProductUpdateWithoutProductInput>;
export const ClientProductUpdateWithoutProductInputObjectZodSchema = makeSchema();

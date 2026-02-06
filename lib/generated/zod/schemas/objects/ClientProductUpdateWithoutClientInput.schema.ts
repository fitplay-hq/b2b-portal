import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { ProductUpdateOneRequiredWithoutClientsNestedInputObjectSchema as ProductUpdateOneRequiredWithoutClientsNestedInputObjectSchema } from './ProductUpdateOneRequiredWithoutClientsNestedInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  updatedAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  product: z.lazy(() => ProductUpdateOneRequiredWithoutClientsNestedInputObjectSchema).optional()
}).strict();
export const ClientProductUpdateWithoutClientInputObjectSchema: z.ZodType<Prisma.ClientProductUpdateWithoutClientInput> = makeSchema() as unknown as z.ZodType<Prisma.ClientProductUpdateWithoutClientInput>;
export const ClientProductUpdateWithoutClientInputObjectZodSchema = makeSchema();

import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { ClientUpdateOneRequiredWithoutProductsNestedInputObjectSchema as ClientUpdateOneRequiredWithoutProductsNestedInputObjectSchema } from './ClientUpdateOneRequiredWithoutProductsNestedInput.schema';
import { ProductUpdateOneRequiredWithoutClientsNestedInputObjectSchema as ProductUpdateOneRequiredWithoutClientsNestedInputObjectSchema } from './ProductUpdateOneRequiredWithoutClientsNestedInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  updatedAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  client: z.lazy(() => ClientUpdateOneRequiredWithoutProductsNestedInputObjectSchema).optional(),
  product: z.lazy(() => ProductUpdateOneRequiredWithoutClientsNestedInputObjectSchema).optional()
}).strict();
export const ClientProductUpdateInputObjectSchema: z.ZodType<Prisma.ClientProductUpdateInput> = makeSchema() as unknown as z.ZodType<Prisma.ClientProductUpdateInput>;
export const ClientProductUpdateInputObjectZodSchema = makeSchema();

import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { ProductUncheckedUpdateManyWithoutCompaniesNestedInputObjectSchema as ProductUncheckedUpdateManyWithoutCompaniesNestedInputObjectSchema } from './ProductUncheckedUpdateManyWithoutCompaniesNestedInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  address: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  updatedAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  products: z.lazy(() => ProductUncheckedUpdateManyWithoutCompaniesNestedInputObjectSchema).optional()
}).strict();
export const CompanyUncheckedUpdateWithoutClientsInputObjectSchema: z.ZodType<Prisma.CompanyUncheckedUpdateWithoutClientsInput> = makeSchema() as unknown as z.ZodType<Prisma.CompanyUncheckedUpdateWithoutClientsInput>;
export const CompanyUncheckedUpdateWithoutClientsInputObjectZodSchema = makeSchema();

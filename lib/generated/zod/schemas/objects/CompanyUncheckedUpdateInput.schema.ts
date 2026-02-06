import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { ProductUncheckedUpdateManyWithoutCompaniesNestedInputObjectSchema as ProductUncheckedUpdateManyWithoutCompaniesNestedInputObjectSchema } from './ProductUncheckedUpdateManyWithoutCompaniesNestedInput.schema';
import { ClientUncheckedUpdateManyWithoutCompanyNestedInputObjectSchema as ClientUncheckedUpdateManyWithoutCompanyNestedInputObjectSchema } from './ClientUncheckedUpdateManyWithoutCompanyNestedInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  name: z.union([z.string().max(50), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  address: z.union([z.string().max(100), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  updatedAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  products: z.lazy(() => ProductUncheckedUpdateManyWithoutCompaniesNestedInputObjectSchema).optional(),
  clients: z.lazy(() => ClientUncheckedUpdateManyWithoutCompanyNestedInputObjectSchema).optional()
}).strict();
export const CompanyUncheckedUpdateInputObjectSchema: z.ZodType<Prisma.CompanyUncheckedUpdateInput> = makeSchema() as unknown as z.ZodType<Prisma.CompanyUncheckedUpdateInput>;
export const CompanyUncheckedUpdateInputObjectZodSchema = makeSchema();

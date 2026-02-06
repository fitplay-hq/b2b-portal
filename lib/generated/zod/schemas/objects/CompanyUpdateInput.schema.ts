import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { ProductUpdateManyWithoutCompaniesNestedInputObjectSchema as ProductUpdateManyWithoutCompaniesNestedInputObjectSchema } from './ProductUpdateManyWithoutCompaniesNestedInput.schema';
import { ClientUpdateManyWithoutCompanyNestedInputObjectSchema as ClientUpdateManyWithoutCompanyNestedInputObjectSchema } from './ClientUpdateManyWithoutCompanyNestedInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  name: z.union([z.string().max(50), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  address: z.union([z.string().max(100), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  updatedAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  products: z.lazy(() => ProductUpdateManyWithoutCompaniesNestedInputObjectSchema).optional(),
  clients: z.lazy(() => ClientUpdateManyWithoutCompanyNestedInputObjectSchema).optional()
}).strict();
export const CompanyUpdateInputObjectSchema: z.ZodType<Prisma.CompanyUpdateInput> = makeSchema() as unknown as z.ZodType<Prisma.CompanyUpdateInput>;
export const CompanyUpdateInputObjectZodSchema = makeSchema();

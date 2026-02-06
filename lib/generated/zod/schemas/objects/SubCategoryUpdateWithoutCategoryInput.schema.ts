import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { ProductUpdateManyWithoutSubCategoryNestedInputObjectSchema as ProductUpdateManyWithoutSubCategoryNestedInputObjectSchema } from './ProductUpdateManyWithoutSubCategoryNestedInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  shortCode: z.union([z.string().max(10), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  updatedAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  products: z.lazy(() => ProductUpdateManyWithoutSubCategoryNestedInputObjectSchema).optional()
}).strict();
export const SubCategoryUpdateWithoutCategoryInputObjectSchema: z.ZodType<Prisma.SubCategoryUpdateWithoutCategoryInput> = makeSchema() as unknown as z.ZodType<Prisma.SubCategoryUpdateWithoutCategoryInput>;
export const SubCategoryUpdateWithoutCategoryInputObjectZodSchema = makeSchema();

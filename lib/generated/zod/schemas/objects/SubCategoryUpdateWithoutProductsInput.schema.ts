import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { StringFieldUpdateOperationsInputObjectSchema as StringFieldUpdateOperationsInputObjectSchema } from './StringFieldUpdateOperationsInput.schema';
import { DateTimeFieldUpdateOperationsInputObjectSchema as DateTimeFieldUpdateOperationsInputObjectSchema } from './DateTimeFieldUpdateOperationsInput.schema';
import { ProductCategoryUpdateOneRequiredWithoutSubCategoriesNestedInputObjectSchema as ProductCategoryUpdateOneRequiredWithoutSubCategoriesNestedInputObjectSchema } from './ProductCategoryUpdateOneRequiredWithoutSubCategoriesNestedInput.schema'

const makeSchema = () => z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  shortCode: z.union([z.string().max(10), z.lazy(() => StringFieldUpdateOperationsInputObjectSchema)]).optional(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  updatedAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputObjectSchema)]).optional(),
  category: z.lazy(() => ProductCategoryUpdateOneRequiredWithoutSubCategoriesNestedInputObjectSchema).optional()
}).strict();
export const SubCategoryUpdateWithoutProductsInputObjectSchema: z.ZodType<Prisma.SubCategoryUpdateWithoutProductsInput> = makeSchema() as unknown as z.ZodType<Prisma.SubCategoryUpdateWithoutProductsInput>;
export const SubCategoryUpdateWithoutProductsInputObjectZodSchema = makeSchema();

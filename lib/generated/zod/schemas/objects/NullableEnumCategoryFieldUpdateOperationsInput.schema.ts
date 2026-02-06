import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { CategorySchema } from '../enums/Category.schema'

const makeSchema = () => z.object({
  set: CategorySchema.optional()
}).strict();
export const NullableEnumCategoryFieldUpdateOperationsInputObjectSchema: z.ZodType<Prisma.NullableEnumCategoryFieldUpdateOperationsInput> = makeSchema() as unknown as z.ZodType<Prisma.NullableEnumCategoryFieldUpdateOperationsInput>;
export const NullableEnumCategoryFieldUpdateOperationsInputObjectZodSchema = makeSchema();

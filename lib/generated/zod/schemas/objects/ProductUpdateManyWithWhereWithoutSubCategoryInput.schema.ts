import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ProductScalarWhereInputObjectSchema as ProductScalarWhereInputObjectSchema } from './ProductScalarWhereInput.schema';
import { ProductUpdateManyMutationInputObjectSchema as ProductUpdateManyMutationInputObjectSchema } from './ProductUpdateManyMutationInput.schema';
import { ProductUncheckedUpdateManyWithoutSubCategoryInputObjectSchema as ProductUncheckedUpdateManyWithoutSubCategoryInputObjectSchema } from './ProductUncheckedUpdateManyWithoutSubCategoryInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ProductScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => ProductUpdateManyMutationInputObjectSchema), z.lazy(() => ProductUncheckedUpdateManyWithoutSubCategoryInputObjectSchema)])
}).strict();
export const ProductUpdateManyWithWhereWithoutSubCategoryInputObjectSchema: z.ZodType<Prisma.ProductUpdateManyWithWhereWithoutSubCategoryInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductUpdateManyWithWhereWithoutSubCategoryInput>;
export const ProductUpdateManyWithWhereWithoutSubCategoryInputObjectZodSchema = makeSchema();

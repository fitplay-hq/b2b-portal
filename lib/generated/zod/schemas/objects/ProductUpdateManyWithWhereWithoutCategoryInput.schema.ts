import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ProductScalarWhereInputObjectSchema as ProductScalarWhereInputObjectSchema } from './ProductScalarWhereInput.schema';
import { ProductUpdateManyMutationInputObjectSchema as ProductUpdateManyMutationInputObjectSchema } from './ProductUpdateManyMutationInput.schema';
import { ProductUncheckedUpdateManyWithoutCategoryInputObjectSchema as ProductUncheckedUpdateManyWithoutCategoryInputObjectSchema } from './ProductUncheckedUpdateManyWithoutCategoryInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ProductScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => ProductUpdateManyMutationInputObjectSchema), z.lazy(() => ProductUncheckedUpdateManyWithoutCategoryInputObjectSchema)])
}).strict();
export const ProductUpdateManyWithWhereWithoutCategoryInputObjectSchema: z.ZodType<Prisma.ProductUpdateManyWithWhereWithoutCategoryInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductUpdateManyWithWhereWithoutCategoryInput>;
export const ProductUpdateManyWithWhereWithoutCategoryInputObjectZodSchema = makeSchema();

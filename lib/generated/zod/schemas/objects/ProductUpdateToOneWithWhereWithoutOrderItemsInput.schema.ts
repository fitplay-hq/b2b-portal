import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ProductWhereInputObjectSchema as ProductWhereInputObjectSchema } from './ProductWhereInput.schema';
import { ProductUpdateWithoutOrderItemsInputObjectSchema as ProductUpdateWithoutOrderItemsInputObjectSchema } from './ProductUpdateWithoutOrderItemsInput.schema';
import { ProductUncheckedUpdateWithoutOrderItemsInputObjectSchema as ProductUncheckedUpdateWithoutOrderItemsInputObjectSchema } from './ProductUncheckedUpdateWithoutOrderItemsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ProductWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => ProductUpdateWithoutOrderItemsInputObjectSchema), z.lazy(() => ProductUncheckedUpdateWithoutOrderItemsInputObjectSchema)])
}).strict();
export const ProductUpdateToOneWithWhereWithoutOrderItemsInputObjectSchema: z.ZodType<Prisma.ProductUpdateToOneWithWhereWithoutOrderItemsInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductUpdateToOneWithWhereWithoutOrderItemsInput>;
export const ProductUpdateToOneWithWhereWithoutOrderItemsInputObjectZodSchema = makeSchema();

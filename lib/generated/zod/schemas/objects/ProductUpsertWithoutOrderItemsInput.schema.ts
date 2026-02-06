import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ProductUpdateWithoutOrderItemsInputObjectSchema as ProductUpdateWithoutOrderItemsInputObjectSchema } from './ProductUpdateWithoutOrderItemsInput.schema';
import { ProductUncheckedUpdateWithoutOrderItemsInputObjectSchema as ProductUncheckedUpdateWithoutOrderItemsInputObjectSchema } from './ProductUncheckedUpdateWithoutOrderItemsInput.schema';
import { ProductCreateWithoutOrderItemsInputObjectSchema as ProductCreateWithoutOrderItemsInputObjectSchema } from './ProductCreateWithoutOrderItemsInput.schema';
import { ProductUncheckedCreateWithoutOrderItemsInputObjectSchema as ProductUncheckedCreateWithoutOrderItemsInputObjectSchema } from './ProductUncheckedCreateWithoutOrderItemsInput.schema';
import { ProductWhereInputObjectSchema as ProductWhereInputObjectSchema } from './ProductWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => ProductUpdateWithoutOrderItemsInputObjectSchema), z.lazy(() => ProductUncheckedUpdateWithoutOrderItemsInputObjectSchema)]),
  create: z.union([z.lazy(() => ProductCreateWithoutOrderItemsInputObjectSchema), z.lazy(() => ProductUncheckedCreateWithoutOrderItemsInputObjectSchema)]),
  where: z.lazy(() => ProductWhereInputObjectSchema).optional()
}).strict();
export const ProductUpsertWithoutOrderItemsInputObjectSchema: z.ZodType<Prisma.ProductUpsertWithoutOrderItemsInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductUpsertWithoutOrderItemsInput>;
export const ProductUpsertWithoutOrderItemsInputObjectZodSchema = makeSchema();

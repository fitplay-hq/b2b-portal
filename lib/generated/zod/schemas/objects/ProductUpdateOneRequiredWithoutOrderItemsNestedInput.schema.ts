import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ProductCreateWithoutOrderItemsInputObjectSchema as ProductCreateWithoutOrderItemsInputObjectSchema } from './ProductCreateWithoutOrderItemsInput.schema';
import { ProductUncheckedCreateWithoutOrderItemsInputObjectSchema as ProductUncheckedCreateWithoutOrderItemsInputObjectSchema } from './ProductUncheckedCreateWithoutOrderItemsInput.schema';
import { ProductCreateOrConnectWithoutOrderItemsInputObjectSchema as ProductCreateOrConnectWithoutOrderItemsInputObjectSchema } from './ProductCreateOrConnectWithoutOrderItemsInput.schema';
import { ProductUpsertWithoutOrderItemsInputObjectSchema as ProductUpsertWithoutOrderItemsInputObjectSchema } from './ProductUpsertWithoutOrderItemsInput.schema';
import { ProductWhereUniqueInputObjectSchema as ProductWhereUniqueInputObjectSchema } from './ProductWhereUniqueInput.schema';
import { ProductUpdateToOneWithWhereWithoutOrderItemsInputObjectSchema as ProductUpdateToOneWithWhereWithoutOrderItemsInputObjectSchema } from './ProductUpdateToOneWithWhereWithoutOrderItemsInput.schema';
import { ProductUpdateWithoutOrderItemsInputObjectSchema as ProductUpdateWithoutOrderItemsInputObjectSchema } from './ProductUpdateWithoutOrderItemsInput.schema';
import { ProductUncheckedUpdateWithoutOrderItemsInputObjectSchema as ProductUncheckedUpdateWithoutOrderItemsInputObjectSchema } from './ProductUncheckedUpdateWithoutOrderItemsInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ProductCreateWithoutOrderItemsInputObjectSchema), z.lazy(() => ProductUncheckedCreateWithoutOrderItemsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ProductCreateOrConnectWithoutOrderItemsInputObjectSchema).optional(),
  upsert: z.lazy(() => ProductUpsertWithoutOrderItemsInputObjectSchema).optional(),
  connect: z.lazy(() => ProductWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => ProductUpdateToOneWithWhereWithoutOrderItemsInputObjectSchema), z.lazy(() => ProductUpdateWithoutOrderItemsInputObjectSchema), z.lazy(() => ProductUncheckedUpdateWithoutOrderItemsInputObjectSchema)]).optional()
}).strict();
export const ProductUpdateOneRequiredWithoutOrderItemsNestedInputObjectSchema: z.ZodType<Prisma.ProductUpdateOneRequiredWithoutOrderItemsNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductUpdateOneRequiredWithoutOrderItemsNestedInput>;
export const ProductUpdateOneRequiredWithoutOrderItemsNestedInputObjectZodSchema = makeSchema();

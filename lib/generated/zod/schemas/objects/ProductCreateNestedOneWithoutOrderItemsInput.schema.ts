import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ProductCreateWithoutOrderItemsInputObjectSchema as ProductCreateWithoutOrderItemsInputObjectSchema } from './ProductCreateWithoutOrderItemsInput.schema';
import { ProductUncheckedCreateWithoutOrderItemsInputObjectSchema as ProductUncheckedCreateWithoutOrderItemsInputObjectSchema } from './ProductUncheckedCreateWithoutOrderItemsInput.schema';
import { ProductCreateOrConnectWithoutOrderItemsInputObjectSchema as ProductCreateOrConnectWithoutOrderItemsInputObjectSchema } from './ProductCreateOrConnectWithoutOrderItemsInput.schema';
import { ProductWhereUniqueInputObjectSchema as ProductWhereUniqueInputObjectSchema } from './ProductWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ProductCreateWithoutOrderItemsInputObjectSchema), z.lazy(() => ProductUncheckedCreateWithoutOrderItemsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ProductCreateOrConnectWithoutOrderItemsInputObjectSchema).optional(),
  connect: z.lazy(() => ProductWhereUniqueInputObjectSchema).optional()
}).strict();
export const ProductCreateNestedOneWithoutOrderItemsInputObjectSchema: z.ZodType<Prisma.ProductCreateNestedOneWithoutOrderItemsInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductCreateNestedOneWithoutOrderItemsInput>;
export const ProductCreateNestedOneWithoutOrderItemsInputObjectZodSchema = makeSchema();

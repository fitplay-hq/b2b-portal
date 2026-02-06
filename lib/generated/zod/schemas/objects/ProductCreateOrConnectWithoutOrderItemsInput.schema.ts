import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ProductWhereUniqueInputObjectSchema as ProductWhereUniqueInputObjectSchema } from './ProductWhereUniqueInput.schema';
import { ProductCreateWithoutOrderItemsInputObjectSchema as ProductCreateWithoutOrderItemsInputObjectSchema } from './ProductCreateWithoutOrderItemsInput.schema';
import { ProductUncheckedCreateWithoutOrderItemsInputObjectSchema as ProductUncheckedCreateWithoutOrderItemsInputObjectSchema } from './ProductUncheckedCreateWithoutOrderItemsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ProductWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => ProductCreateWithoutOrderItemsInputObjectSchema), z.lazy(() => ProductUncheckedCreateWithoutOrderItemsInputObjectSchema)])
}).strict();
export const ProductCreateOrConnectWithoutOrderItemsInputObjectSchema: z.ZodType<Prisma.ProductCreateOrConnectWithoutOrderItemsInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductCreateOrConnectWithoutOrderItemsInput>;
export const ProductCreateOrConnectWithoutOrderItemsInputObjectZodSchema = makeSchema();

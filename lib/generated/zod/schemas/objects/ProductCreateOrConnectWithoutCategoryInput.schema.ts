import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ProductWhereUniqueInputObjectSchema as ProductWhereUniqueInputObjectSchema } from './ProductWhereUniqueInput.schema';
import { ProductCreateWithoutCategoryInputObjectSchema as ProductCreateWithoutCategoryInputObjectSchema } from './ProductCreateWithoutCategoryInput.schema';
import { ProductUncheckedCreateWithoutCategoryInputObjectSchema as ProductUncheckedCreateWithoutCategoryInputObjectSchema } from './ProductUncheckedCreateWithoutCategoryInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ProductWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => ProductCreateWithoutCategoryInputObjectSchema), z.lazy(() => ProductUncheckedCreateWithoutCategoryInputObjectSchema)])
}).strict();
export const ProductCreateOrConnectWithoutCategoryInputObjectSchema: z.ZodType<Prisma.ProductCreateOrConnectWithoutCategoryInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductCreateOrConnectWithoutCategoryInput>;
export const ProductCreateOrConnectWithoutCategoryInputObjectZodSchema = makeSchema();

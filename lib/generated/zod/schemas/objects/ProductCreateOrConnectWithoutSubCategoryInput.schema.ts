import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ProductWhereUniqueInputObjectSchema as ProductWhereUniqueInputObjectSchema } from './ProductWhereUniqueInput.schema';
import { ProductCreateWithoutSubCategoryInputObjectSchema as ProductCreateWithoutSubCategoryInputObjectSchema } from './ProductCreateWithoutSubCategoryInput.schema';
import { ProductUncheckedCreateWithoutSubCategoryInputObjectSchema as ProductUncheckedCreateWithoutSubCategoryInputObjectSchema } from './ProductUncheckedCreateWithoutSubCategoryInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ProductWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => ProductCreateWithoutSubCategoryInputObjectSchema), z.lazy(() => ProductUncheckedCreateWithoutSubCategoryInputObjectSchema)])
}).strict();
export const ProductCreateOrConnectWithoutSubCategoryInputObjectSchema: z.ZodType<Prisma.ProductCreateOrConnectWithoutSubCategoryInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductCreateOrConnectWithoutSubCategoryInput>;
export const ProductCreateOrConnectWithoutSubCategoryInputObjectZodSchema = makeSchema();

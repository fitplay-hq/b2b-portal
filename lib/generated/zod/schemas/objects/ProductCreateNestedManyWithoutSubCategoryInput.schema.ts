import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ProductCreateWithoutSubCategoryInputObjectSchema as ProductCreateWithoutSubCategoryInputObjectSchema } from './ProductCreateWithoutSubCategoryInput.schema';
import { ProductUncheckedCreateWithoutSubCategoryInputObjectSchema as ProductUncheckedCreateWithoutSubCategoryInputObjectSchema } from './ProductUncheckedCreateWithoutSubCategoryInput.schema';
import { ProductCreateOrConnectWithoutSubCategoryInputObjectSchema as ProductCreateOrConnectWithoutSubCategoryInputObjectSchema } from './ProductCreateOrConnectWithoutSubCategoryInput.schema';
import { ProductCreateManySubCategoryInputEnvelopeObjectSchema as ProductCreateManySubCategoryInputEnvelopeObjectSchema } from './ProductCreateManySubCategoryInputEnvelope.schema';
import { ProductWhereUniqueInputObjectSchema as ProductWhereUniqueInputObjectSchema } from './ProductWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ProductCreateWithoutSubCategoryInputObjectSchema), z.lazy(() => ProductCreateWithoutSubCategoryInputObjectSchema).array(), z.lazy(() => ProductUncheckedCreateWithoutSubCategoryInputObjectSchema), z.lazy(() => ProductUncheckedCreateWithoutSubCategoryInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => ProductCreateOrConnectWithoutSubCategoryInputObjectSchema), z.lazy(() => ProductCreateOrConnectWithoutSubCategoryInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => ProductCreateManySubCategoryInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => ProductWhereUniqueInputObjectSchema), z.lazy(() => ProductWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const ProductCreateNestedManyWithoutSubCategoryInputObjectSchema: z.ZodType<Prisma.ProductCreateNestedManyWithoutSubCategoryInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductCreateNestedManyWithoutSubCategoryInput>;
export const ProductCreateNestedManyWithoutSubCategoryInputObjectZodSchema = makeSchema();

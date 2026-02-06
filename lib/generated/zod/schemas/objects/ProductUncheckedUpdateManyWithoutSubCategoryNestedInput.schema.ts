import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ProductCreateWithoutSubCategoryInputObjectSchema as ProductCreateWithoutSubCategoryInputObjectSchema } from './ProductCreateWithoutSubCategoryInput.schema';
import { ProductUncheckedCreateWithoutSubCategoryInputObjectSchema as ProductUncheckedCreateWithoutSubCategoryInputObjectSchema } from './ProductUncheckedCreateWithoutSubCategoryInput.schema';
import { ProductCreateOrConnectWithoutSubCategoryInputObjectSchema as ProductCreateOrConnectWithoutSubCategoryInputObjectSchema } from './ProductCreateOrConnectWithoutSubCategoryInput.schema';
import { ProductUpsertWithWhereUniqueWithoutSubCategoryInputObjectSchema as ProductUpsertWithWhereUniqueWithoutSubCategoryInputObjectSchema } from './ProductUpsertWithWhereUniqueWithoutSubCategoryInput.schema';
import { ProductCreateManySubCategoryInputEnvelopeObjectSchema as ProductCreateManySubCategoryInputEnvelopeObjectSchema } from './ProductCreateManySubCategoryInputEnvelope.schema';
import { ProductWhereUniqueInputObjectSchema as ProductWhereUniqueInputObjectSchema } from './ProductWhereUniqueInput.schema';
import { ProductUpdateWithWhereUniqueWithoutSubCategoryInputObjectSchema as ProductUpdateWithWhereUniqueWithoutSubCategoryInputObjectSchema } from './ProductUpdateWithWhereUniqueWithoutSubCategoryInput.schema';
import { ProductUpdateManyWithWhereWithoutSubCategoryInputObjectSchema as ProductUpdateManyWithWhereWithoutSubCategoryInputObjectSchema } from './ProductUpdateManyWithWhereWithoutSubCategoryInput.schema';
import { ProductScalarWhereInputObjectSchema as ProductScalarWhereInputObjectSchema } from './ProductScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ProductCreateWithoutSubCategoryInputObjectSchema), z.lazy(() => ProductCreateWithoutSubCategoryInputObjectSchema).array(), z.lazy(() => ProductUncheckedCreateWithoutSubCategoryInputObjectSchema), z.lazy(() => ProductUncheckedCreateWithoutSubCategoryInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => ProductCreateOrConnectWithoutSubCategoryInputObjectSchema), z.lazy(() => ProductCreateOrConnectWithoutSubCategoryInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => ProductUpsertWithWhereUniqueWithoutSubCategoryInputObjectSchema), z.lazy(() => ProductUpsertWithWhereUniqueWithoutSubCategoryInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => ProductCreateManySubCategoryInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => ProductWhereUniqueInputObjectSchema), z.lazy(() => ProductWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => ProductWhereUniqueInputObjectSchema), z.lazy(() => ProductWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => ProductWhereUniqueInputObjectSchema), z.lazy(() => ProductWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => ProductWhereUniqueInputObjectSchema), z.lazy(() => ProductWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => ProductUpdateWithWhereUniqueWithoutSubCategoryInputObjectSchema), z.lazy(() => ProductUpdateWithWhereUniqueWithoutSubCategoryInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => ProductUpdateManyWithWhereWithoutSubCategoryInputObjectSchema), z.lazy(() => ProductUpdateManyWithWhereWithoutSubCategoryInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => ProductScalarWhereInputObjectSchema), z.lazy(() => ProductScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const ProductUncheckedUpdateManyWithoutSubCategoryNestedInputObjectSchema: z.ZodType<Prisma.ProductUncheckedUpdateManyWithoutSubCategoryNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductUncheckedUpdateManyWithoutSubCategoryNestedInput>;
export const ProductUncheckedUpdateManyWithoutSubCategoryNestedInputObjectZodSchema = makeSchema();

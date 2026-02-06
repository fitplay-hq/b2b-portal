import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ProductCreateWithoutCompaniesInputObjectSchema as ProductCreateWithoutCompaniesInputObjectSchema } from './ProductCreateWithoutCompaniesInput.schema';
import { ProductUncheckedCreateWithoutCompaniesInputObjectSchema as ProductUncheckedCreateWithoutCompaniesInputObjectSchema } from './ProductUncheckedCreateWithoutCompaniesInput.schema';
import { ProductCreateOrConnectWithoutCompaniesInputObjectSchema as ProductCreateOrConnectWithoutCompaniesInputObjectSchema } from './ProductCreateOrConnectWithoutCompaniesInput.schema';
import { ProductWhereUniqueInputObjectSchema as ProductWhereUniqueInputObjectSchema } from './ProductWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ProductCreateWithoutCompaniesInputObjectSchema), z.lazy(() => ProductCreateWithoutCompaniesInputObjectSchema).array(), z.lazy(() => ProductUncheckedCreateWithoutCompaniesInputObjectSchema), z.lazy(() => ProductUncheckedCreateWithoutCompaniesInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => ProductCreateOrConnectWithoutCompaniesInputObjectSchema), z.lazy(() => ProductCreateOrConnectWithoutCompaniesInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => ProductWhereUniqueInputObjectSchema), z.lazy(() => ProductWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const ProductCreateNestedManyWithoutCompaniesInputObjectSchema: z.ZodType<Prisma.ProductCreateNestedManyWithoutCompaniesInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductCreateNestedManyWithoutCompaniesInput>;
export const ProductCreateNestedManyWithoutCompaniesInputObjectZodSchema = makeSchema();

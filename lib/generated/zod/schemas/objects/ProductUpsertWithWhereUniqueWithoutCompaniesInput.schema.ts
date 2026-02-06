import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ProductWhereUniqueInputObjectSchema as ProductWhereUniqueInputObjectSchema } from './ProductWhereUniqueInput.schema';
import { ProductUpdateWithoutCompaniesInputObjectSchema as ProductUpdateWithoutCompaniesInputObjectSchema } from './ProductUpdateWithoutCompaniesInput.schema';
import { ProductUncheckedUpdateWithoutCompaniesInputObjectSchema as ProductUncheckedUpdateWithoutCompaniesInputObjectSchema } from './ProductUncheckedUpdateWithoutCompaniesInput.schema';
import { ProductCreateWithoutCompaniesInputObjectSchema as ProductCreateWithoutCompaniesInputObjectSchema } from './ProductCreateWithoutCompaniesInput.schema';
import { ProductUncheckedCreateWithoutCompaniesInputObjectSchema as ProductUncheckedCreateWithoutCompaniesInputObjectSchema } from './ProductUncheckedCreateWithoutCompaniesInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ProductWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => ProductUpdateWithoutCompaniesInputObjectSchema), z.lazy(() => ProductUncheckedUpdateWithoutCompaniesInputObjectSchema)]),
  create: z.union([z.lazy(() => ProductCreateWithoutCompaniesInputObjectSchema), z.lazy(() => ProductUncheckedCreateWithoutCompaniesInputObjectSchema)])
}).strict();
export const ProductUpsertWithWhereUniqueWithoutCompaniesInputObjectSchema: z.ZodType<Prisma.ProductUpsertWithWhereUniqueWithoutCompaniesInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductUpsertWithWhereUniqueWithoutCompaniesInput>;
export const ProductUpsertWithWhereUniqueWithoutCompaniesInputObjectZodSchema = makeSchema();

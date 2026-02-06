import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ProductWhereUniqueInputObjectSchema as ProductWhereUniqueInputObjectSchema } from './ProductWhereUniqueInput.schema';
import { ProductUpdateWithoutCompaniesInputObjectSchema as ProductUpdateWithoutCompaniesInputObjectSchema } from './ProductUpdateWithoutCompaniesInput.schema';
import { ProductUncheckedUpdateWithoutCompaniesInputObjectSchema as ProductUncheckedUpdateWithoutCompaniesInputObjectSchema } from './ProductUncheckedUpdateWithoutCompaniesInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ProductWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => ProductUpdateWithoutCompaniesInputObjectSchema), z.lazy(() => ProductUncheckedUpdateWithoutCompaniesInputObjectSchema)])
}).strict();
export const ProductUpdateWithWhereUniqueWithoutCompaniesInputObjectSchema: z.ZodType<Prisma.ProductUpdateWithWhereUniqueWithoutCompaniesInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductUpdateWithWhereUniqueWithoutCompaniesInput>;
export const ProductUpdateWithWhereUniqueWithoutCompaniesInputObjectZodSchema = makeSchema();

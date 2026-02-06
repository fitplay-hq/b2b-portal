import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ProductScalarWhereInputObjectSchema as ProductScalarWhereInputObjectSchema } from './ProductScalarWhereInput.schema';
import { ProductUpdateManyMutationInputObjectSchema as ProductUpdateManyMutationInputObjectSchema } from './ProductUpdateManyMutationInput.schema';
import { ProductUncheckedUpdateManyWithoutCompaniesInputObjectSchema as ProductUncheckedUpdateManyWithoutCompaniesInputObjectSchema } from './ProductUncheckedUpdateManyWithoutCompaniesInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ProductScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => ProductUpdateManyMutationInputObjectSchema), z.lazy(() => ProductUncheckedUpdateManyWithoutCompaniesInputObjectSchema)])
}).strict();
export const ProductUpdateManyWithWhereWithoutCompaniesInputObjectSchema: z.ZodType<Prisma.ProductUpdateManyWithWhereWithoutCompaniesInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductUpdateManyWithWhereWithoutCompaniesInput>;
export const ProductUpdateManyWithWhereWithoutCompaniesInputObjectZodSchema = makeSchema();

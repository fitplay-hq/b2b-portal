import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ProductWhereUniqueInputObjectSchema as ProductWhereUniqueInputObjectSchema } from './ProductWhereUniqueInput.schema';
import { ProductCreateWithoutCompaniesInputObjectSchema as ProductCreateWithoutCompaniesInputObjectSchema } from './ProductCreateWithoutCompaniesInput.schema';
import { ProductUncheckedCreateWithoutCompaniesInputObjectSchema as ProductUncheckedCreateWithoutCompaniesInputObjectSchema } from './ProductUncheckedCreateWithoutCompaniesInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ProductWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => ProductCreateWithoutCompaniesInputObjectSchema), z.lazy(() => ProductUncheckedCreateWithoutCompaniesInputObjectSchema)])
}).strict();
export const ProductCreateOrConnectWithoutCompaniesInputObjectSchema: z.ZodType<Prisma.ProductCreateOrConnectWithoutCompaniesInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductCreateOrConnectWithoutCompaniesInput>;
export const ProductCreateOrConnectWithoutCompaniesInputObjectZodSchema = makeSchema();

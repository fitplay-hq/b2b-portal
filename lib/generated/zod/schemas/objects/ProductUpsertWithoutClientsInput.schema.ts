import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ProductUpdateWithoutClientsInputObjectSchema as ProductUpdateWithoutClientsInputObjectSchema } from './ProductUpdateWithoutClientsInput.schema';
import { ProductUncheckedUpdateWithoutClientsInputObjectSchema as ProductUncheckedUpdateWithoutClientsInputObjectSchema } from './ProductUncheckedUpdateWithoutClientsInput.schema';
import { ProductCreateWithoutClientsInputObjectSchema as ProductCreateWithoutClientsInputObjectSchema } from './ProductCreateWithoutClientsInput.schema';
import { ProductUncheckedCreateWithoutClientsInputObjectSchema as ProductUncheckedCreateWithoutClientsInputObjectSchema } from './ProductUncheckedCreateWithoutClientsInput.schema';
import { ProductWhereInputObjectSchema as ProductWhereInputObjectSchema } from './ProductWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => ProductUpdateWithoutClientsInputObjectSchema), z.lazy(() => ProductUncheckedUpdateWithoutClientsInputObjectSchema)]),
  create: z.union([z.lazy(() => ProductCreateWithoutClientsInputObjectSchema), z.lazy(() => ProductUncheckedCreateWithoutClientsInputObjectSchema)]),
  where: z.lazy(() => ProductWhereInputObjectSchema).optional()
}).strict();
export const ProductUpsertWithoutClientsInputObjectSchema: z.ZodType<Prisma.ProductUpsertWithoutClientsInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductUpsertWithoutClientsInput>;
export const ProductUpsertWithoutClientsInputObjectZodSchema = makeSchema();

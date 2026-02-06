import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ProductWhereInputObjectSchema as ProductWhereInputObjectSchema } from './ProductWhereInput.schema';
import { ProductUpdateWithoutClientsInputObjectSchema as ProductUpdateWithoutClientsInputObjectSchema } from './ProductUpdateWithoutClientsInput.schema';
import { ProductUncheckedUpdateWithoutClientsInputObjectSchema as ProductUncheckedUpdateWithoutClientsInputObjectSchema } from './ProductUncheckedUpdateWithoutClientsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ProductWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => ProductUpdateWithoutClientsInputObjectSchema), z.lazy(() => ProductUncheckedUpdateWithoutClientsInputObjectSchema)])
}).strict();
export const ProductUpdateToOneWithWhereWithoutClientsInputObjectSchema: z.ZodType<Prisma.ProductUpdateToOneWithWhereWithoutClientsInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductUpdateToOneWithWhereWithoutClientsInput>;
export const ProductUpdateToOneWithWhereWithoutClientsInputObjectZodSchema = makeSchema();

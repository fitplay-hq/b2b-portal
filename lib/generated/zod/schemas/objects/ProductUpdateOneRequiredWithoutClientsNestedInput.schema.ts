import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ProductCreateWithoutClientsInputObjectSchema as ProductCreateWithoutClientsInputObjectSchema } from './ProductCreateWithoutClientsInput.schema';
import { ProductUncheckedCreateWithoutClientsInputObjectSchema as ProductUncheckedCreateWithoutClientsInputObjectSchema } from './ProductUncheckedCreateWithoutClientsInput.schema';
import { ProductCreateOrConnectWithoutClientsInputObjectSchema as ProductCreateOrConnectWithoutClientsInputObjectSchema } from './ProductCreateOrConnectWithoutClientsInput.schema';
import { ProductUpsertWithoutClientsInputObjectSchema as ProductUpsertWithoutClientsInputObjectSchema } from './ProductUpsertWithoutClientsInput.schema';
import { ProductWhereUniqueInputObjectSchema as ProductWhereUniqueInputObjectSchema } from './ProductWhereUniqueInput.schema';
import { ProductUpdateToOneWithWhereWithoutClientsInputObjectSchema as ProductUpdateToOneWithWhereWithoutClientsInputObjectSchema } from './ProductUpdateToOneWithWhereWithoutClientsInput.schema';
import { ProductUpdateWithoutClientsInputObjectSchema as ProductUpdateWithoutClientsInputObjectSchema } from './ProductUpdateWithoutClientsInput.schema';
import { ProductUncheckedUpdateWithoutClientsInputObjectSchema as ProductUncheckedUpdateWithoutClientsInputObjectSchema } from './ProductUncheckedUpdateWithoutClientsInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ProductCreateWithoutClientsInputObjectSchema), z.lazy(() => ProductUncheckedCreateWithoutClientsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ProductCreateOrConnectWithoutClientsInputObjectSchema).optional(),
  upsert: z.lazy(() => ProductUpsertWithoutClientsInputObjectSchema).optional(),
  connect: z.lazy(() => ProductWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => ProductUpdateToOneWithWhereWithoutClientsInputObjectSchema), z.lazy(() => ProductUpdateWithoutClientsInputObjectSchema), z.lazy(() => ProductUncheckedUpdateWithoutClientsInputObjectSchema)]).optional()
}).strict();
export const ProductUpdateOneRequiredWithoutClientsNestedInputObjectSchema: z.ZodType<Prisma.ProductUpdateOneRequiredWithoutClientsNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductUpdateOneRequiredWithoutClientsNestedInput>;
export const ProductUpdateOneRequiredWithoutClientsNestedInputObjectZodSchema = makeSchema();

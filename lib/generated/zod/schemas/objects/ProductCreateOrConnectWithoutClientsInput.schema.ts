import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ProductWhereUniqueInputObjectSchema as ProductWhereUniqueInputObjectSchema } from './ProductWhereUniqueInput.schema';
import { ProductCreateWithoutClientsInputObjectSchema as ProductCreateWithoutClientsInputObjectSchema } from './ProductCreateWithoutClientsInput.schema';
import { ProductUncheckedCreateWithoutClientsInputObjectSchema as ProductUncheckedCreateWithoutClientsInputObjectSchema } from './ProductUncheckedCreateWithoutClientsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ProductWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => ProductCreateWithoutClientsInputObjectSchema), z.lazy(() => ProductUncheckedCreateWithoutClientsInputObjectSchema)])
}).strict();
export const ProductCreateOrConnectWithoutClientsInputObjectSchema: z.ZodType<Prisma.ProductCreateOrConnectWithoutClientsInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductCreateOrConnectWithoutClientsInput>;
export const ProductCreateOrConnectWithoutClientsInputObjectZodSchema = makeSchema();

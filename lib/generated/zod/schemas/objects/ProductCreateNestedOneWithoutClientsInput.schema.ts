import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ProductCreateWithoutClientsInputObjectSchema as ProductCreateWithoutClientsInputObjectSchema } from './ProductCreateWithoutClientsInput.schema';
import { ProductUncheckedCreateWithoutClientsInputObjectSchema as ProductUncheckedCreateWithoutClientsInputObjectSchema } from './ProductUncheckedCreateWithoutClientsInput.schema';
import { ProductCreateOrConnectWithoutClientsInputObjectSchema as ProductCreateOrConnectWithoutClientsInputObjectSchema } from './ProductCreateOrConnectWithoutClientsInput.schema';
import { ProductWhereUniqueInputObjectSchema as ProductWhereUniqueInputObjectSchema } from './ProductWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ProductCreateWithoutClientsInputObjectSchema), z.lazy(() => ProductUncheckedCreateWithoutClientsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ProductCreateOrConnectWithoutClientsInputObjectSchema).optional(),
  connect: z.lazy(() => ProductWhereUniqueInputObjectSchema).optional()
}).strict();
export const ProductCreateNestedOneWithoutClientsInputObjectSchema: z.ZodType<Prisma.ProductCreateNestedOneWithoutClientsInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductCreateNestedOneWithoutClientsInput>;
export const ProductCreateNestedOneWithoutClientsInputObjectZodSchema = makeSchema();

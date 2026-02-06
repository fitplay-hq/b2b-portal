import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { BundleOrderItemWhereUniqueInputObjectSchema as BundleOrderItemWhereUniqueInputObjectSchema } from './BundleOrderItemWhereUniqueInput.schema';
import { BundleOrderItemCreateWithoutOrderInputObjectSchema as BundleOrderItemCreateWithoutOrderInputObjectSchema } from './BundleOrderItemCreateWithoutOrderInput.schema';
import { BundleOrderItemUncheckedCreateWithoutOrderInputObjectSchema as BundleOrderItemUncheckedCreateWithoutOrderInputObjectSchema } from './BundleOrderItemUncheckedCreateWithoutOrderInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => BundleOrderItemWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => BundleOrderItemCreateWithoutOrderInputObjectSchema), z.lazy(() => BundleOrderItemUncheckedCreateWithoutOrderInputObjectSchema)])
}).strict();
export const BundleOrderItemCreateOrConnectWithoutOrderInputObjectSchema: z.ZodType<Prisma.BundleOrderItemCreateOrConnectWithoutOrderInput> = makeSchema() as unknown as z.ZodType<Prisma.BundleOrderItemCreateOrConnectWithoutOrderInput>;
export const BundleOrderItemCreateOrConnectWithoutOrderInputObjectZodSchema = makeSchema();

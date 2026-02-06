import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { BundleOrderItemWhereUniqueInputObjectSchema as BundleOrderItemWhereUniqueInputObjectSchema } from './BundleOrderItemWhereUniqueInput.schema';
import { BundleOrderItemCreateWithoutProductInputObjectSchema as BundleOrderItemCreateWithoutProductInputObjectSchema } from './BundleOrderItemCreateWithoutProductInput.schema';
import { BundleOrderItemUncheckedCreateWithoutProductInputObjectSchema as BundleOrderItemUncheckedCreateWithoutProductInputObjectSchema } from './BundleOrderItemUncheckedCreateWithoutProductInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => BundleOrderItemWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => BundleOrderItemCreateWithoutProductInputObjectSchema), z.lazy(() => BundleOrderItemUncheckedCreateWithoutProductInputObjectSchema)])
}).strict();
export const BundleOrderItemCreateOrConnectWithoutProductInputObjectSchema: z.ZodType<Prisma.BundleOrderItemCreateOrConnectWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.BundleOrderItemCreateOrConnectWithoutProductInput>;
export const BundleOrderItemCreateOrConnectWithoutProductInputObjectZodSchema = makeSchema();

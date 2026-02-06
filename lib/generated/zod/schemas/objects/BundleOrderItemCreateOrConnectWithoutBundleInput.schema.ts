import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { BundleOrderItemWhereUniqueInputObjectSchema as BundleOrderItemWhereUniqueInputObjectSchema } from './BundleOrderItemWhereUniqueInput.schema';
import { BundleOrderItemCreateWithoutBundleInputObjectSchema as BundleOrderItemCreateWithoutBundleInputObjectSchema } from './BundleOrderItemCreateWithoutBundleInput.schema';
import { BundleOrderItemUncheckedCreateWithoutBundleInputObjectSchema as BundleOrderItemUncheckedCreateWithoutBundleInputObjectSchema } from './BundleOrderItemUncheckedCreateWithoutBundleInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => BundleOrderItemWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => BundleOrderItemCreateWithoutBundleInputObjectSchema), z.lazy(() => BundleOrderItemUncheckedCreateWithoutBundleInputObjectSchema)])
}).strict();
export const BundleOrderItemCreateOrConnectWithoutBundleInputObjectSchema: z.ZodType<Prisma.BundleOrderItemCreateOrConnectWithoutBundleInput> = makeSchema() as unknown as z.ZodType<Prisma.BundleOrderItemCreateOrConnectWithoutBundleInput>;
export const BundleOrderItemCreateOrConnectWithoutBundleInputObjectZodSchema = makeSchema();

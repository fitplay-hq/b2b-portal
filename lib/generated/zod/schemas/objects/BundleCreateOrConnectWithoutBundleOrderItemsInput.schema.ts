import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { BundleWhereUniqueInputObjectSchema as BundleWhereUniqueInputObjectSchema } from './BundleWhereUniqueInput.schema';
import { BundleCreateWithoutBundleOrderItemsInputObjectSchema as BundleCreateWithoutBundleOrderItemsInputObjectSchema } from './BundleCreateWithoutBundleOrderItemsInput.schema';
import { BundleUncheckedCreateWithoutBundleOrderItemsInputObjectSchema as BundleUncheckedCreateWithoutBundleOrderItemsInputObjectSchema } from './BundleUncheckedCreateWithoutBundleOrderItemsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => BundleWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => BundleCreateWithoutBundleOrderItemsInputObjectSchema), z.lazy(() => BundleUncheckedCreateWithoutBundleOrderItemsInputObjectSchema)])
}).strict();
export const BundleCreateOrConnectWithoutBundleOrderItemsInputObjectSchema: z.ZodType<Prisma.BundleCreateOrConnectWithoutBundleOrderItemsInput> = makeSchema() as unknown as z.ZodType<Prisma.BundleCreateOrConnectWithoutBundleOrderItemsInput>;
export const BundleCreateOrConnectWithoutBundleOrderItemsInputObjectZodSchema = makeSchema();

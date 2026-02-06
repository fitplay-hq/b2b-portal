import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { BundleCreateWithoutBundleOrderItemsInputObjectSchema as BundleCreateWithoutBundleOrderItemsInputObjectSchema } from './BundleCreateWithoutBundleOrderItemsInput.schema';
import { BundleUncheckedCreateWithoutBundleOrderItemsInputObjectSchema as BundleUncheckedCreateWithoutBundleOrderItemsInputObjectSchema } from './BundleUncheckedCreateWithoutBundleOrderItemsInput.schema';
import { BundleCreateOrConnectWithoutBundleOrderItemsInputObjectSchema as BundleCreateOrConnectWithoutBundleOrderItemsInputObjectSchema } from './BundleCreateOrConnectWithoutBundleOrderItemsInput.schema';
import { BundleWhereUniqueInputObjectSchema as BundleWhereUniqueInputObjectSchema } from './BundleWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => BundleCreateWithoutBundleOrderItemsInputObjectSchema), z.lazy(() => BundleUncheckedCreateWithoutBundleOrderItemsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => BundleCreateOrConnectWithoutBundleOrderItemsInputObjectSchema).optional(),
  connect: z.lazy(() => BundleWhereUniqueInputObjectSchema).optional()
}).strict();
export const BundleCreateNestedOneWithoutBundleOrderItemsInputObjectSchema: z.ZodType<Prisma.BundleCreateNestedOneWithoutBundleOrderItemsInput> = makeSchema() as unknown as z.ZodType<Prisma.BundleCreateNestedOneWithoutBundleOrderItemsInput>;
export const BundleCreateNestedOneWithoutBundleOrderItemsInputObjectZodSchema = makeSchema();

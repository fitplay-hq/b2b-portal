import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { BundleCreateWithoutBundleOrderItemsInputObjectSchema as BundleCreateWithoutBundleOrderItemsInputObjectSchema } from './BundleCreateWithoutBundleOrderItemsInput.schema';
import { BundleUncheckedCreateWithoutBundleOrderItemsInputObjectSchema as BundleUncheckedCreateWithoutBundleOrderItemsInputObjectSchema } from './BundleUncheckedCreateWithoutBundleOrderItemsInput.schema';
import { BundleCreateOrConnectWithoutBundleOrderItemsInputObjectSchema as BundleCreateOrConnectWithoutBundleOrderItemsInputObjectSchema } from './BundleCreateOrConnectWithoutBundleOrderItemsInput.schema';
import { BundleUpsertWithoutBundleOrderItemsInputObjectSchema as BundleUpsertWithoutBundleOrderItemsInputObjectSchema } from './BundleUpsertWithoutBundleOrderItemsInput.schema';
import { BundleWhereUniqueInputObjectSchema as BundleWhereUniqueInputObjectSchema } from './BundleWhereUniqueInput.schema';
import { BundleUpdateToOneWithWhereWithoutBundleOrderItemsInputObjectSchema as BundleUpdateToOneWithWhereWithoutBundleOrderItemsInputObjectSchema } from './BundleUpdateToOneWithWhereWithoutBundleOrderItemsInput.schema';
import { BundleUpdateWithoutBundleOrderItemsInputObjectSchema as BundleUpdateWithoutBundleOrderItemsInputObjectSchema } from './BundleUpdateWithoutBundleOrderItemsInput.schema';
import { BundleUncheckedUpdateWithoutBundleOrderItemsInputObjectSchema as BundleUncheckedUpdateWithoutBundleOrderItemsInputObjectSchema } from './BundleUncheckedUpdateWithoutBundleOrderItemsInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => BundleCreateWithoutBundleOrderItemsInputObjectSchema), z.lazy(() => BundleUncheckedCreateWithoutBundleOrderItemsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => BundleCreateOrConnectWithoutBundleOrderItemsInputObjectSchema).optional(),
  upsert: z.lazy(() => BundleUpsertWithoutBundleOrderItemsInputObjectSchema).optional(),
  connect: z.lazy(() => BundleWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => BundleUpdateToOneWithWhereWithoutBundleOrderItemsInputObjectSchema), z.lazy(() => BundleUpdateWithoutBundleOrderItemsInputObjectSchema), z.lazy(() => BundleUncheckedUpdateWithoutBundleOrderItemsInputObjectSchema)]).optional()
}).strict();
export const BundleUpdateOneRequiredWithoutBundleOrderItemsNestedInputObjectSchema: z.ZodType<Prisma.BundleUpdateOneRequiredWithoutBundleOrderItemsNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.BundleUpdateOneRequiredWithoutBundleOrderItemsNestedInput>;
export const BundleUpdateOneRequiredWithoutBundleOrderItemsNestedInputObjectZodSchema = makeSchema();

import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { BundleUpdateWithoutBundleOrderItemsInputObjectSchema as BundleUpdateWithoutBundleOrderItemsInputObjectSchema } from './BundleUpdateWithoutBundleOrderItemsInput.schema';
import { BundleUncheckedUpdateWithoutBundleOrderItemsInputObjectSchema as BundleUncheckedUpdateWithoutBundleOrderItemsInputObjectSchema } from './BundleUncheckedUpdateWithoutBundleOrderItemsInput.schema';
import { BundleCreateWithoutBundleOrderItemsInputObjectSchema as BundleCreateWithoutBundleOrderItemsInputObjectSchema } from './BundleCreateWithoutBundleOrderItemsInput.schema';
import { BundleUncheckedCreateWithoutBundleOrderItemsInputObjectSchema as BundleUncheckedCreateWithoutBundleOrderItemsInputObjectSchema } from './BundleUncheckedCreateWithoutBundleOrderItemsInput.schema';
import { BundleWhereInputObjectSchema as BundleWhereInputObjectSchema } from './BundleWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => BundleUpdateWithoutBundleOrderItemsInputObjectSchema), z.lazy(() => BundleUncheckedUpdateWithoutBundleOrderItemsInputObjectSchema)]),
  create: z.union([z.lazy(() => BundleCreateWithoutBundleOrderItemsInputObjectSchema), z.lazy(() => BundleUncheckedCreateWithoutBundleOrderItemsInputObjectSchema)]),
  where: z.lazy(() => BundleWhereInputObjectSchema).optional()
}).strict();
export const BundleUpsertWithoutBundleOrderItemsInputObjectSchema: z.ZodType<Prisma.BundleUpsertWithoutBundleOrderItemsInput> = makeSchema() as unknown as z.ZodType<Prisma.BundleUpsertWithoutBundleOrderItemsInput>;
export const BundleUpsertWithoutBundleOrderItemsInputObjectZodSchema = makeSchema();

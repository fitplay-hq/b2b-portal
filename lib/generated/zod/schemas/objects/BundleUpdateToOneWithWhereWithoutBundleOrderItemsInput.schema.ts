import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { BundleWhereInputObjectSchema as BundleWhereInputObjectSchema } from './BundleWhereInput.schema';
import { BundleUpdateWithoutBundleOrderItemsInputObjectSchema as BundleUpdateWithoutBundleOrderItemsInputObjectSchema } from './BundleUpdateWithoutBundleOrderItemsInput.schema';
import { BundleUncheckedUpdateWithoutBundleOrderItemsInputObjectSchema as BundleUncheckedUpdateWithoutBundleOrderItemsInputObjectSchema } from './BundleUncheckedUpdateWithoutBundleOrderItemsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => BundleWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => BundleUpdateWithoutBundleOrderItemsInputObjectSchema), z.lazy(() => BundleUncheckedUpdateWithoutBundleOrderItemsInputObjectSchema)])
}).strict();
export const BundleUpdateToOneWithWhereWithoutBundleOrderItemsInputObjectSchema: z.ZodType<Prisma.BundleUpdateToOneWithWhereWithoutBundleOrderItemsInput> = makeSchema() as unknown as z.ZodType<Prisma.BundleUpdateToOneWithWhereWithoutBundleOrderItemsInput>;
export const BundleUpdateToOneWithWhereWithoutBundleOrderItemsInputObjectZodSchema = makeSchema();

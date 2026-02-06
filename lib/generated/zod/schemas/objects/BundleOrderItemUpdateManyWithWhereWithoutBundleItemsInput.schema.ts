import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { BundleOrderItemScalarWhereInputObjectSchema as BundleOrderItemScalarWhereInputObjectSchema } from './BundleOrderItemScalarWhereInput.schema';
import { BundleOrderItemUpdateManyMutationInputObjectSchema as BundleOrderItemUpdateManyMutationInputObjectSchema } from './BundleOrderItemUpdateManyMutationInput.schema';
import { BundleOrderItemUncheckedUpdateManyWithoutBundleItemsInputObjectSchema as BundleOrderItemUncheckedUpdateManyWithoutBundleItemsInputObjectSchema } from './BundleOrderItemUncheckedUpdateManyWithoutBundleItemsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => BundleOrderItemScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => BundleOrderItemUpdateManyMutationInputObjectSchema), z.lazy(() => BundleOrderItemUncheckedUpdateManyWithoutBundleItemsInputObjectSchema)])
}).strict();
export const BundleOrderItemUpdateManyWithWhereWithoutBundleItemsInputObjectSchema: z.ZodType<Prisma.BundleOrderItemUpdateManyWithWhereWithoutBundleItemsInput> = makeSchema() as unknown as z.ZodType<Prisma.BundleOrderItemUpdateManyWithWhereWithoutBundleItemsInput>;
export const BundleOrderItemUpdateManyWithWhereWithoutBundleItemsInputObjectZodSchema = makeSchema();

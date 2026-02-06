import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { BundleItemScalarWhereInputObjectSchema as BundleItemScalarWhereInputObjectSchema } from './BundleItemScalarWhereInput.schema';
import { BundleItemUpdateManyMutationInputObjectSchema as BundleItemUpdateManyMutationInputObjectSchema } from './BundleItemUpdateManyMutationInput.schema';
import { BundleItemUncheckedUpdateManyWithoutBundleOrderItemsInputObjectSchema as BundleItemUncheckedUpdateManyWithoutBundleOrderItemsInputObjectSchema } from './BundleItemUncheckedUpdateManyWithoutBundleOrderItemsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => BundleItemScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => BundleItemUpdateManyMutationInputObjectSchema), z.lazy(() => BundleItemUncheckedUpdateManyWithoutBundleOrderItemsInputObjectSchema)])
}).strict();
export const BundleItemUpdateManyWithWhereWithoutBundleOrderItemsInputObjectSchema: z.ZodType<Prisma.BundleItemUpdateManyWithWhereWithoutBundleOrderItemsInput> = makeSchema() as unknown as z.ZodType<Prisma.BundleItemUpdateManyWithWhereWithoutBundleOrderItemsInput>;
export const BundleItemUpdateManyWithWhereWithoutBundleOrderItemsInputObjectZodSchema = makeSchema();

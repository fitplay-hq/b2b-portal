import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { BundleOrderItemScalarWhereInputObjectSchema as BundleOrderItemScalarWhereInputObjectSchema } from './BundleOrderItemScalarWhereInput.schema';
import { BundleOrderItemUpdateManyMutationInputObjectSchema as BundleOrderItemUpdateManyMutationInputObjectSchema } from './BundleOrderItemUpdateManyMutationInput.schema';
import { BundleOrderItemUncheckedUpdateManyWithoutBundleInputObjectSchema as BundleOrderItemUncheckedUpdateManyWithoutBundleInputObjectSchema } from './BundleOrderItemUncheckedUpdateManyWithoutBundleInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => BundleOrderItemScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => BundleOrderItemUpdateManyMutationInputObjectSchema), z.lazy(() => BundleOrderItemUncheckedUpdateManyWithoutBundleInputObjectSchema)])
}).strict();
export const BundleOrderItemUpdateManyWithWhereWithoutBundleInputObjectSchema: z.ZodType<Prisma.BundleOrderItemUpdateManyWithWhereWithoutBundleInput> = makeSchema() as unknown as z.ZodType<Prisma.BundleOrderItemUpdateManyWithWhereWithoutBundleInput>;
export const BundleOrderItemUpdateManyWithWhereWithoutBundleInputObjectZodSchema = makeSchema();

import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { BundleOrderItemScalarWhereInputObjectSchema as BundleOrderItemScalarWhereInputObjectSchema } from './BundleOrderItemScalarWhereInput.schema';
import { BundleOrderItemUpdateManyMutationInputObjectSchema as BundleOrderItemUpdateManyMutationInputObjectSchema } from './BundleOrderItemUpdateManyMutationInput.schema';
import { BundleOrderItemUncheckedUpdateManyWithoutProductInputObjectSchema as BundleOrderItemUncheckedUpdateManyWithoutProductInputObjectSchema } from './BundleOrderItemUncheckedUpdateManyWithoutProductInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => BundleOrderItemScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => BundleOrderItemUpdateManyMutationInputObjectSchema), z.lazy(() => BundleOrderItemUncheckedUpdateManyWithoutProductInputObjectSchema)])
}).strict();
export const BundleOrderItemUpdateManyWithWhereWithoutProductInputObjectSchema: z.ZodType<Prisma.BundleOrderItemUpdateManyWithWhereWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.BundleOrderItemUpdateManyWithWhereWithoutProductInput>;
export const BundleOrderItemUpdateManyWithWhereWithoutProductInputObjectZodSchema = makeSchema();

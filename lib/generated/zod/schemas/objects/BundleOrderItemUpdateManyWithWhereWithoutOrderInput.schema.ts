import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { BundleOrderItemScalarWhereInputObjectSchema as BundleOrderItemScalarWhereInputObjectSchema } from './BundleOrderItemScalarWhereInput.schema';
import { BundleOrderItemUpdateManyMutationInputObjectSchema as BundleOrderItemUpdateManyMutationInputObjectSchema } from './BundleOrderItemUpdateManyMutationInput.schema';
import { BundleOrderItemUncheckedUpdateManyWithoutOrderInputObjectSchema as BundleOrderItemUncheckedUpdateManyWithoutOrderInputObjectSchema } from './BundleOrderItemUncheckedUpdateManyWithoutOrderInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => BundleOrderItemScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => BundleOrderItemUpdateManyMutationInputObjectSchema), z.lazy(() => BundleOrderItemUncheckedUpdateManyWithoutOrderInputObjectSchema)])
}).strict();
export const BundleOrderItemUpdateManyWithWhereWithoutOrderInputObjectSchema: z.ZodType<Prisma.BundleOrderItemUpdateManyWithWhereWithoutOrderInput> = makeSchema() as unknown as z.ZodType<Prisma.BundleOrderItemUpdateManyWithWhereWithoutOrderInput>;
export const BundleOrderItemUpdateManyWithWhereWithoutOrderInputObjectZodSchema = makeSchema();

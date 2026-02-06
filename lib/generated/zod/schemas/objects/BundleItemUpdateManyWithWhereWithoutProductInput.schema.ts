import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { BundleItemScalarWhereInputObjectSchema as BundleItemScalarWhereInputObjectSchema } from './BundleItemScalarWhereInput.schema';
import { BundleItemUpdateManyMutationInputObjectSchema as BundleItemUpdateManyMutationInputObjectSchema } from './BundleItemUpdateManyMutationInput.schema';
import { BundleItemUncheckedUpdateManyWithoutProductInputObjectSchema as BundleItemUncheckedUpdateManyWithoutProductInputObjectSchema } from './BundleItemUncheckedUpdateManyWithoutProductInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => BundleItemScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => BundleItemUpdateManyMutationInputObjectSchema), z.lazy(() => BundleItemUncheckedUpdateManyWithoutProductInputObjectSchema)])
}).strict();
export const BundleItemUpdateManyWithWhereWithoutProductInputObjectSchema: z.ZodType<Prisma.BundleItemUpdateManyWithWhereWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.BundleItemUpdateManyWithWhereWithoutProductInput>;
export const BundleItemUpdateManyWithWhereWithoutProductInputObjectZodSchema = makeSchema();

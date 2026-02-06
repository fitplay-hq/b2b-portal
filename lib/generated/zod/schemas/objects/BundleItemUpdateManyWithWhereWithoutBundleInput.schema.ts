import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { BundleItemScalarWhereInputObjectSchema as BundleItemScalarWhereInputObjectSchema } from './BundleItemScalarWhereInput.schema';
import { BundleItemUpdateManyMutationInputObjectSchema as BundleItemUpdateManyMutationInputObjectSchema } from './BundleItemUpdateManyMutationInput.schema';
import { BundleItemUncheckedUpdateManyWithoutBundleInputObjectSchema as BundleItemUncheckedUpdateManyWithoutBundleInputObjectSchema } from './BundleItemUncheckedUpdateManyWithoutBundleInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => BundleItemScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => BundleItemUpdateManyMutationInputObjectSchema), z.lazy(() => BundleItemUncheckedUpdateManyWithoutBundleInputObjectSchema)])
}).strict();
export const BundleItemUpdateManyWithWhereWithoutBundleInputObjectSchema: z.ZodType<Prisma.BundleItemUpdateManyWithWhereWithoutBundleInput> = makeSchema() as unknown as z.ZodType<Prisma.BundleItemUpdateManyWithWhereWithoutBundleInput>;
export const BundleItemUpdateManyWithWhereWithoutBundleInputObjectZodSchema = makeSchema();

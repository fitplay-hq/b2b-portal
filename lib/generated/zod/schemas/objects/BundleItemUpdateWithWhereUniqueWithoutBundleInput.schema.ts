import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { BundleItemWhereUniqueInputObjectSchema as BundleItemWhereUniqueInputObjectSchema } from './BundleItemWhereUniqueInput.schema';
import { BundleItemUpdateWithoutBundleInputObjectSchema as BundleItemUpdateWithoutBundleInputObjectSchema } from './BundleItemUpdateWithoutBundleInput.schema';
import { BundleItemUncheckedUpdateWithoutBundleInputObjectSchema as BundleItemUncheckedUpdateWithoutBundleInputObjectSchema } from './BundleItemUncheckedUpdateWithoutBundleInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => BundleItemWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => BundleItemUpdateWithoutBundleInputObjectSchema), z.lazy(() => BundleItemUncheckedUpdateWithoutBundleInputObjectSchema)])
}).strict();
export const BundleItemUpdateWithWhereUniqueWithoutBundleInputObjectSchema: z.ZodType<Prisma.BundleItemUpdateWithWhereUniqueWithoutBundleInput> = makeSchema() as unknown as z.ZodType<Prisma.BundleItemUpdateWithWhereUniqueWithoutBundleInput>;
export const BundleItemUpdateWithWhereUniqueWithoutBundleInputObjectZodSchema = makeSchema();

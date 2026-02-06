import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { BundleItemWhereUniqueInputObjectSchema as BundleItemWhereUniqueInputObjectSchema } from './BundleItemWhereUniqueInput.schema';
import { BundleItemUpdateWithoutProductInputObjectSchema as BundleItemUpdateWithoutProductInputObjectSchema } from './BundleItemUpdateWithoutProductInput.schema';
import { BundleItemUncheckedUpdateWithoutProductInputObjectSchema as BundleItemUncheckedUpdateWithoutProductInputObjectSchema } from './BundleItemUncheckedUpdateWithoutProductInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => BundleItemWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => BundleItemUpdateWithoutProductInputObjectSchema), z.lazy(() => BundleItemUncheckedUpdateWithoutProductInputObjectSchema)])
}).strict();
export const BundleItemUpdateWithWhereUniqueWithoutProductInputObjectSchema: z.ZodType<Prisma.BundleItemUpdateWithWhereUniqueWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.BundleItemUpdateWithWhereUniqueWithoutProductInput>;
export const BundleItemUpdateWithWhereUniqueWithoutProductInputObjectZodSchema = makeSchema();

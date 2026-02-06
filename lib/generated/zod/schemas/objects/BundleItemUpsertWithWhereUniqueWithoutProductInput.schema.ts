import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { BundleItemWhereUniqueInputObjectSchema as BundleItemWhereUniqueInputObjectSchema } from './BundleItemWhereUniqueInput.schema';
import { BundleItemUpdateWithoutProductInputObjectSchema as BundleItemUpdateWithoutProductInputObjectSchema } from './BundleItemUpdateWithoutProductInput.schema';
import { BundleItemUncheckedUpdateWithoutProductInputObjectSchema as BundleItemUncheckedUpdateWithoutProductInputObjectSchema } from './BundleItemUncheckedUpdateWithoutProductInput.schema';
import { BundleItemCreateWithoutProductInputObjectSchema as BundleItemCreateWithoutProductInputObjectSchema } from './BundleItemCreateWithoutProductInput.schema';
import { BundleItemUncheckedCreateWithoutProductInputObjectSchema as BundleItemUncheckedCreateWithoutProductInputObjectSchema } from './BundleItemUncheckedCreateWithoutProductInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => BundleItemWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => BundleItemUpdateWithoutProductInputObjectSchema), z.lazy(() => BundleItemUncheckedUpdateWithoutProductInputObjectSchema)]),
  create: z.union([z.lazy(() => BundleItemCreateWithoutProductInputObjectSchema), z.lazy(() => BundleItemUncheckedCreateWithoutProductInputObjectSchema)])
}).strict();
export const BundleItemUpsertWithWhereUniqueWithoutProductInputObjectSchema: z.ZodType<Prisma.BundleItemUpsertWithWhereUniqueWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.BundleItemUpsertWithWhereUniqueWithoutProductInput>;
export const BundleItemUpsertWithWhereUniqueWithoutProductInputObjectZodSchema = makeSchema();

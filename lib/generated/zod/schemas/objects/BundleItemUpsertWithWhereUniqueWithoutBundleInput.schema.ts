import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { BundleItemWhereUniqueInputObjectSchema as BundleItemWhereUniqueInputObjectSchema } from './BundleItemWhereUniqueInput.schema';
import { BundleItemUpdateWithoutBundleInputObjectSchema as BundleItemUpdateWithoutBundleInputObjectSchema } from './BundleItemUpdateWithoutBundleInput.schema';
import { BundleItemUncheckedUpdateWithoutBundleInputObjectSchema as BundleItemUncheckedUpdateWithoutBundleInputObjectSchema } from './BundleItemUncheckedUpdateWithoutBundleInput.schema';
import { BundleItemCreateWithoutBundleInputObjectSchema as BundleItemCreateWithoutBundleInputObjectSchema } from './BundleItemCreateWithoutBundleInput.schema';
import { BundleItemUncheckedCreateWithoutBundleInputObjectSchema as BundleItemUncheckedCreateWithoutBundleInputObjectSchema } from './BundleItemUncheckedCreateWithoutBundleInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => BundleItemWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => BundleItemUpdateWithoutBundleInputObjectSchema), z.lazy(() => BundleItemUncheckedUpdateWithoutBundleInputObjectSchema)]),
  create: z.union([z.lazy(() => BundleItemCreateWithoutBundleInputObjectSchema), z.lazy(() => BundleItemUncheckedCreateWithoutBundleInputObjectSchema)])
}).strict();
export const BundleItemUpsertWithWhereUniqueWithoutBundleInputObjectSchema: z.ZodType<Prisma.BundleItemUpsertWithWhereUniqueWithoutBundleInput> = makeSchema() as unknown as z.ZodType<Prisma.BundleItemUpsertWithWhereUniqueWithoutBundleInput>;
export const BundleItemUpsertWithWhereUniqueWithoutBundleInputObjectZodSchema = makeSchema();

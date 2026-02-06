import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { BundleOrderItemWhereUniqueInputObjectSchema as BundleOrderItemWhereUniqueInputObjectSchema } from './BundleOrderItemWhereUniqueInput.schema';
import { BundleOrderItemUpdateWithoutBundleInputObjectSchema as BundleOrderItemUpdateWithoutBundleInputObjectSchema } from './BundleOrderItemUpdateWithoutBundleInput.schema';
import { BundleOrderItemUncheckedUpdateWithoutBundleInputObjectSchema as BundleOrderItemUncheckedUpdateWithoutBundleInputObjectSchema } from './BundleOrderItemUncheckedUpdateWithoutBundleInput.schema';
import { BundleOrderItemCreateWithoutBundleInputObjectSchema as BundleOrderItemCreateWithoutBundleInputObjectSchema } from './BundleOrderItemCreateWithoutBundleInput.schema';
import { BundleOrderItemUncheckedCreateWithoutBundleInputObjectSchema as BundleOrderItemUncheckedCreateWithoutBundleInputObjectSchema } from './BundleOrderItemUncheckedCreateWithoutBundleInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => BundleOrderItemWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => BundleOrderItemUpdateWithoutBundleInputObjectSchema), z.lazy(() => BundleOrderItemUncheckedUpdateWithoutBundleInputObjectSchema)]),
  create: z.union([z.lazy(() => BundleOrderItemCreateWithoutBundleInputObjectSchema), z.lazy(() => BundleOrderItemUncheckedCreateWithoutBundleInputObjectSchema)])
}).strict();
export const BundleOrderItemUpsertWithWhereUniqueWithoutBundleInputObjectSchema: z.ZodType<Prisma.BundleOrderItemUpsertWithWhereUniqueWithoutBundleInput> = makeSchema() as unknown as z.ZodType<Prisma.BundleOrderItemUpsertWithWhereUniqueWithoutBundleInput>;
export const BundleOrderItemUpsertWithWhereUniqueWithoutBundleInputObjectZodSchema = makeSchema();

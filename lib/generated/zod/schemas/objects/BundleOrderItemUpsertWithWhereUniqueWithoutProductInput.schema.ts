import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { BundleOrderItemWhereUniqueInputObjectSchema as BundleOrderItemWhereUniqueInputObjectSchema } from './BundleOrderItemWhereUniqueInput.schema';
import { BundleOrderItemUpdateWithoutProductInputObjectSchema as BundleOrderItemUpdateWithoutProductInputObjectSchema } from './BundleOrderItemUpdateWithoutProductInput.schema';
import { BundleOrderItemUncheckedUpdateWithoutProductInputObjectSchema as BundleOrderItemUncheckedUpdateWithoutProductInputObjectSchema } from './BundleOrderItemUncheckedUpdateWithoutProductInput.schema';
import { BundleOrderItemCreateWithoutProductInputObjectSchema as BundleOrderItemCreateWithoutProductInputObjectSchema } from './BundleOrderItemCreateWithoutProductInput.schema';
import { BundleOrderItemUncheckedCreateWithoutProductInputObjectSchema as BundleOrderItemUncheckedCreateWithoutProductInputObjectSchema } from './BundleOrderItemUncheckedCreateWithoutProductInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => BundleOrderItemWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => BundleOrderItemUpdateWithoutProductInputObjectSchema), z.lazy(() => BundleOrderItemUncheckedUpdateWithoutProductInputObjectSchema)]),
  create: z.union([z.lazy(() => BundleOrderItemCreateWithoutProductInputObjectSchema), z.lazy(() => BundleOrderItemUncheckedCreateWithoutProductInputObjectSchema)])
}).strict();
export const BundleOrderItemUpsertWithWhereUniqueWithoutProductInputObjectSchema: z.ZodType<Prisma.BundleOrderItemUpsertWithWhereUniqueWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.BundleOrderItemUpsertWithWhereUniqueWithoutProductInput>;
export const BundleOrderItemUpsertWithWhereUniqueWithoutProductInputObjectZodSchema = makeSchema();

import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { BundleOrderItemWhereUniqueInputObjectSchema as BundleOrderItemWhereUniqueInputObjectSchema } from './BundleOrderItemWhereUniqueInput.schema';
import { BundleOrderItemUpdateWithoutOrderInputObjectSchema as BundleOrderItemUpdateWithoutOrderInputObjectSchema } from './BundleOrderItemUpdateWithoutOrderInput.schema';
import { BundleOrderItemUncheckedUpdateWithoutOrderInputObjectSchema as BundleOrderItemUncheckedUpdateWithoutOrderInputObjectSchema } from './BundleOrderItemUncheckedUpdateWithoutOrderInput.schema';
import { BundleOrderItemCreateWithoutOrderInputObjectSchema as BundleOrderItemCreateWithoutOrderInputObjectSchema } from './BundleOrderItemCreateWithoutOrderInput.schema';
import { BundleOrderItemUncheckedCreateWithoutOrderInputObjectSchema as BundleOrderItemUncheckedCreateWithoutOrderInputObjectSchema } from './BundleOrderItemUncheckedCreateWithoutOrderInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => BundleOrderItemWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => BundleOrderItemUpdateWithoutOrderInputObjectSchema), z.lazy(() => BundleOrderItemUncheckedUpdateWithoutOrderInputObjectSchema)]),
  create: z.union([z.lazy(() => BundleOrderItemCreateWithoutOrderInputObjectSchema), z.lazy(() => BundleOrderItemUncheckedCreateWithoutOrderInputObjectSchema)])
}).strict();
export const BundleOrderItemUpsertWithWhereUniqueWithoutOrderInputObjectSchema: z.ZodType<Prisma.BundleOrderItemUpsertWithWhereUniqueWithoutOrderInput> = makeSchema() as unknown as z.ZodType<Prisma.BundleOrderItemUpsertWithWhereUniqueWithoutOrderInput>;
export const BundleOrderItemUpsertWithWhereUniqueWithoutOrderInputObjectZodSchema = makeSchema();

import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { BundleOrderItemWhereUniqueInputObjectSchema as BundleOrderItemWhereUniqueInputObjectSchema } from './BundleOrderItemWhereUniqueInput.schema';
import { BundleOrderItemUpdateWithoutProductInputObjectSchema as BundleOrderItemUpdateWithoutProductInputObjectSchema } from './BundleOrderItemUpdateWithoutProductInput.schema';
import { BundleOrderItemUncheckedUpdateWithoutProductInputObjectSchema as BundleOrderItemUncheckedUpdateWithoutProductInputObjectSchema } from './BundleOrderItemUncheckedUpdateWithoutProductInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => BundleOrderItemWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => BundleOrderItemUpdateWithoutProductInputObjectSchema), z.lazy(() => BundleOrderItemUncheckedUpdateWithoutProductInputObjectSchema)])
}).strict();
export const BundleOrderItemUpdateWithWhereUniqueWithoutProductInputObjectSchema: z.ZodType<Prisma.BundleOrderItemUpdateWithWhereUniqueWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.BundleOrderItemUpdateWithWhereUniqueWithoutProductInput>;
export const BundleOrderItemUpdateWithWhereUniqueWithoutProductInputObjectZodSchema = makeSchema();

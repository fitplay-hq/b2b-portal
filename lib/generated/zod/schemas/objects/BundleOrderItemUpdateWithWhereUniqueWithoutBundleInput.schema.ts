import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { BundleOrderItemWhereUniqueInputObjectSchema as BundleOrderItemWhereUniqueInputObjectSchema } from './BundleOrderItemWhereUniqueInput.schema';
import { BundleOrderItemUpdateWithoutBundleInputObjectSchema as BundleOrderItemUpdateWithoutBundleInputObjectSchema } from './BundleOrderItemUpdateWithoutBundleInput.schema';
import { BundleOrderItemUncheckedUpdateWithoutBundleInputObjectSchema as BundleOrderItemUncheckedUpdateWithoutBundleInputObjectSchema } from './BundleOrderItemUncheckedUpdateWithoutBundleInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => BundleOrderItemWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => BundleOrderItemUpdateWithoutBundleInputObjectSchema), z.lazy(() => BundleOrderItemUncheckedUpdateWithoutBundleInputObjectSchema)])
}).strict();
export const BundleOrderItemUpdateWithWhereUniqueWithoutBundleInputObjectSchema: z.ZodType<Prisma.BundleOrderItemUpdateWithWhereUniqueWithoutBundleInput> = makeSchema() as unknown as z.ZodType<Prisma.BundleOrderItemUpdateWithWhereUniqueWithoutBundleInput>;
export const BundleOrderItemUpdateWithWhereUniqueWithoutBundleInputObjectZodSchema = makeSchema();

import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { BundleOrderItemWhereUniqueInputObjectSchema as BundleOrderItemWhereUniqueInputObjectSchema } from './BundleOrderItemWhereUniqueInput.schema';
import { BundleOrderItemUpdateWithoutOrderInputObjectSchema as BundleOrderItemUpdateWithoutOrderInputObjectSchema } from './BundleOrderItemUpdateWithoutOrderInput.schema';
import { BundleOrderItemUncheckedUpdateWithoutOrderInputObjectSchema as BundleOrderItemUncheckedUpdateWithoutOrderInputObjectSchema } from './BundleOrderItemUncheckedUpdateWithoutOrderInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => BundleOrderItemWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => BundleOrderItemUpdateWithoutOrderInputObjectSchema), z.lazy(() => BundleOrderItemUncheckedUpdateWithoutOrderInputObjectSchema)])
}).strict();
export const BundleOrderItemUpdateWithWhereUniqueWithoutOrderInputObjectSchema: z.ZodType<Prisma.BundleOrderItemUpdateWithWhereUniqueWithoutOrderInput> = makeSchema() as unknown as z.ZodType<Prisma.BundleOrderItemUpdateWithWhereUniqueWithoutOrderInput>;
export const BundleOrderItemUpdateWithWhereUniqueWithoutOrderInputObjectZodSchema = makeSchema();

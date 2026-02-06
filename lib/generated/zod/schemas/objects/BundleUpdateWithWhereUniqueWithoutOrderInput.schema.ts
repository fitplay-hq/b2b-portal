import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { BundleWhereUniqueInputObjectSchema as BundleWhereUniqueInputObjectSchema } from './BundleWhereUniqueInput.schema';
import { BundleUpdateWithoutOrderInputObjectSchema as BundleUpdateWithoutOrderInputObjectSchema } from './BundleUpdateWithoutOrderInput.schema';
import { BundleUncheckedUpdateWithoutOrderInputObjectSchema as BundleUncheckedUpdateWithoutOrderInputObjectSchema } from './BundleUncheckedUpdateWithoutOrderInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => BundleWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => BundleUpdateWithoutOrderInputObjectSchema), z.lazy(() => BundleUncheckedUpdateWithoutOrderInputObjectSchema)])
}).strict();
export const BundleUpdateWithWhereUniqueWithoutOrderInputObjectSchema: z.ZodType<Prisma.BundleUpdateWithWhereUniqueWithoutOrderInput> = makeSchema() as unknown as z.ZodType<Prisma.BundleUpdateWithWhereUniqueWithoutOrderInput>;
export const BundleUpdateWithWhereUniqueWithoutOrderInputObjectZodSchema = makeSchema();

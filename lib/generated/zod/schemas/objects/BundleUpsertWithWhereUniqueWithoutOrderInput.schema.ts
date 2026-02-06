import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { BundleWhereUniqueInputObjectSchema as BundleWhereUniqueInputObjectSchema } from './BundleWhereUniqueInput.schema';
import { BundleUpdateWithoutOrderInputObjectSchema as BundleUpdateWithoutOrderInputObjectSchema } from './BundleUpdateWithoutOrderInput.schema';
import { BundleUncheckedUpdateWithoutOrderInputObjectSchema as BundleUncheckedUpdateWithoutOrderInputObjectSchema } from './BundleUncheckedUpdateWithoutOrderInput.schema';
import { BundleCreateWithoutOrderInputObjectSchema as BundleCreateWithoutOrderInputObjectSchema } from './BundleCreateWithoutOrderInput.schema';
import { BundleUncheckedCreateWithoutOrderInputObjectSchema as BundleUncheckedCreateWithoutOrderInputObjectSchema } from './BundleUncheckedCreateWithoutOrderInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => BundleWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => BundleUpdateWithoutOrderInputObjectSchema), z.lazy(() => BundleUncheckedUpdateWithoutOrderInputObjectSchema)]),
  create: z.union([z.lazy(() => BundleCreateWithoutOrderInputObjectSchema), z.lazy(() => BundleUncheckedCreateWithoutOrderInputObjectSchema)])
}).strict();
export const BundleUpsertWithWhereUniqueWithoutOrderInputObjectSchema: z.ZodType<Prisma.BundleUpsertWithWhereUniqueWithoutOrderInput> = makeSchema() as unknown as z.ZodType<Prisma.BundleUpsertWithWhereUniqueWithoutOrderInput>;
export const BundleUpsertWithWhereUniqueWithoutOrderInputObjectZodSchema = makeSchema();

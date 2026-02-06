import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { BundleUpdateWithoutItemsInputObjectSchema as BundleUpdateWithoutItemsInputObjectSchema } from './BundleUpdateWithoutItemsInput.schema';
import { BundleUncheckedUpdateWithoutItemsInputObjectSchema as BundleUncheckedUpdateWithoutItemsInputObjectSchema } from './BundleUncheckedUpdateWithoutItemsInput.schema';
import { BundleCreateWithoutItemsInputObjectSchema as BundleCreateWithoutItemsInputObjectSchema } from './BundleCreateWithoutItemsInput.schema';
import { BundleUncheckedCreateWithoutItemsInputObjectSchema as BundleUncheckedCreateWithoutItemsInputObjectSchema } from './BundleUncheckedCreateWithoutItemsInput.schema';
import { BundleWhereInputObjectSchema as BundleWhereInputObjectSchema } from './BundleWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => BundleUpdateWithoutItemsInputObjectSchema), z.lazy(() => BundleUncheckedUpdateWithoutItemsInputObjectSchema)]),
  create: z.union([z.lazy(() => BundleCreateWithoutItemsInputObjectSchema), z.lazy(() => BundleUncheckedCreateWithoutItemsInputObjectSchema)]),
  where: z.lazy(() => BundleWhereInputObjectSchema).optional()
}).strict();
export const BundleUpsertWithoutItemsInputObjectSchema: z.ZodType<Prisma.BundleUpsertWithoutItemsInput> = makeSchema() as unknown as z.ZodType<Prisma.BundleUpsertWithoutItemsInput>;
export const BundleUpsertWithoutItemsInputObjectZodSchema = makeSchema();

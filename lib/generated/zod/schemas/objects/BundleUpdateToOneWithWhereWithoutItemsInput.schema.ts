import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { BundleWhereInputObjectSchema as BundleWhereInputObjectSchema } from './BundleWhereInput.schema';
import { BundleUpdateWithoutItemsInputObjectSchema as BundleUpdateWithoutItemsInputObjectSchema } from './BundleUpdateWithoutItemsInput.schema';
import { BundleUncheckedUpdateWithoutItemsInputObjectSchema as BundleUncheckedUpdateWithoutItemsInputObjectSchema } from './BundleUncheckedUpdateWithoutItemsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => BundleWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => BundleUpdateWithoutItemsInputObjectSchema), z.lazy(() => BundleUncheckedUpdateWithoutItemsInputObjectSchema)])
}).strict();
export const BundleUpdateToOneWithWhereWithoutItemsInputObjectSchema: z.ZodType<Prisma.BundleUpdateToOneWithWhereWithoutItemsInput> = makeSchema() as unknown as z.ZodType<Prisma.BundleUpdateToOneWithWhereWithoutItemsInput>;
export const BundleUpdateToOneWithWhereWithoutItemsInputObjectZodSchema = makeSchema();

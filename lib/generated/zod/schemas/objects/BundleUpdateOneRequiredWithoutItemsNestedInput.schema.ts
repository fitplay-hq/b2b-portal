import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { BundleCreateWithoutItemsInputObjectSchema as BundleCreateWithoutItemsInputObjectSchema } from './BundleCreateWithoutItemsInput.schema';
import { BundleUncheckedCreateWithoutItemsInputObjectSchema as BundleUncheckedCreateWithoutItemsInputObjectSchema } from './BundleUncheckedCreateWithoutItemsInput.schema';
import { BundleCreateOrConnectWithoutItemsInputObjectSchema as BundleCreateOrConnectWithoutItemsInputObjectSchema } from './BundleCreateOrConnectWithoutItemsInput.schema';
import { BundleUpsertWithoutItemsInputObjectSchema as BundleUpsertWithoutItemsInputObjectSchema } from './BundleUpsertWithoutItemsInput.schema';
import { BundleWhereUniqueInputObjectSchema as BundleWhereUniqueInputObjectSchema } from './BundleWhereUniqueInput.schema';
import { BundleUpdateToOneWithWhereWithoutItemsInputObjectSchema as BundleUpdateToOneWithWhereWithoutItemsInputObjectSchema } from './BundleUpdateToOneWithWhereWithoutItemsInput.schema';
import { BundleUpdateWithoutItemsInputObjectSchema as BundleUpdateWithoutItemsInputObjectSchema } from './BundleUpdateWithoutItemsInput.schema';
import { BundleUncheckedUpdateWithoutItemsInputObjectSchema as BundleUncheckedUpdateWithoutItemsInputObjectSchema } from './BundleUncheckedUpdateWithoutItemsInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => BundleCreateWithoutItemsInputObjectSchema), z.lazy(() => BundleUncheckedCreateWithoutItemsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => BundleCreateOrConnectWithoutItemsInputObjectSchema).optional(),
  upsert: z.lazy(() => BundleUpsertWithoutItemsInputObjectSchema).optional(),
  connect: z.lazy(() => BundleWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => BundleUpdateToOneWithWhereWithoutItemsInputObjectSchema), z.lazy(() => BundleUpdateWithoutItemsInputObjectSchema), z.lazy(() => BundleUncheckedUpdateWithoutItemsInputObjectSchema)]).optional()
}).strict();
export const BundleUpdateOneRequiredWithoutItemsNestedInputObjectSchema: z.ZodType<Prisma.BundleUpdateOneRequiredWithoutItemsNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.BundleUpdateOneRequiredWithoutItemsNestedInput>;
export const BundleUpdateOneRequiredWithoutItemsNestedInputObjectZodSchema = makeSchema();

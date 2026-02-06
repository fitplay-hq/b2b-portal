import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { BundleCreateWithoutItemsInputObjectSchema as BundleCreateWithoutItemsInputObjectSchema } from './BundleCreateWithoutItemsInput.schema';
import { BundleUncheckedCreateWithoutItemsInputObjectSchema as BundleUncheckedCreateWithoutItemsInputObjectSchema } from './BundleUncheckedCreateWithoutItemsInput.schema';
import { BundleCreateOrConnectWithoutItemsInputObjectSchema as BundleCreateOrConnectWithoutItemsInputObjectSchema } from './BundleCreateOrConnectWithoutItemsInput.schema';
import { BundleWhereUniqueInputObjectSchema as BundleWhereUniqueInputObjectSchema } from './BundleWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => BundleCreateWithoutItemsInputObjectSchema), z.lazy(() => BundleUncheckedCreateWithoutItemsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => BundleCreateOrConnectWithoutItemsInputObjectSchema).optional(),
  connect: z.lazy(() => BundleWhereUniqueInputObjectSchema).optional()
}).strict();
export const BundleCreateNestedOneWithoutItemsInputObjectSchema: z.ZodType<Prisma.BundleCreateNestedOneWithoutItemsInput> = makeSchema() as unknown as z.ZodType<Prisma.BundleCreateNestedOneWithoutItemsInput>;
export const BundleCreateNestedOneWithoutItemsInputObjectZodSchema = makeSchema();

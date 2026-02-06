import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { BundleWhereUniqueInputObjectSchema as BundleWhereUniqueInputObjectSchema } from './BundleWhereUniqueInput.schema';
import { BundleCreateWithoutItemsInputObjectSchema as BundleCreateWithoutItemsInputObjectSchema } from './BundleCreateWithoutItemsInput.schema';
import { BundleUncheckedCreateWithoutItemsInputObjectSchema as BundleUncheckedCreateWithoutItemsInputObjectSchema } from './BundleUncheckedCreateWithoutItemsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => BundleWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => BundleCreateWithoutItemsInputObjectSchema), z.lazy(() => BundleUncheckedCreateWithoutItemsInputObjectSchema)])
}).strict();
export const BundleCreateOrConnectWithoutItemsInputObjectSchema: z.ZodType<Prisma.BundleCreateOrConnectWithoutItemsInput> = makeSchema() as unknown as z.ZodType<Prisma.BundleCreateOrConnectWithoutItemsInput>;
export const BundleCreateOrConnectWithoutItemsInputObjectZodSchema = makeSchema();

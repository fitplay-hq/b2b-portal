import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { BundleItemWhereUniqueInputObjectSchema as BundleItemWhereUniqueInputObjectSchema } from './BundleItemWhereUniqueInput.schema';
import { BundleItemCreateWithoutBundleInputObjectSchema as BundleItemCreateWithoutBundleInputObjectSchema } from './BundleItemCreateWithoutBundleInput.schema';
import { BundleItemUncheckedCreateWithoutBundleInputObjectSchema as BundleItemUncheckedCreateWithoutBundleInputObjectSchema } from './BundleItemUncheckedCreateWithoutBundleInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => BundleItemWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => BundleItemCreateWithoutBundleInputObjectSchema), z.lazy(() => BundleItemUncheckedCreateWithoutBundleInputObjectSchema)])
}).strict();
export const BundleItemCreateOrConnectWithoutBundleInputObjectSchema: z.ZodType<Prisma.BundleItemCreateOrConnectWithoutBundleInput> = makeSchema() as unknown as z.ZodType<Prisma.BundleItemCreateOrConnectWithoutBundleInput>;
export const BundleItemCreateOrConnectWithoutBundleInputObjectZodSchema = makeSchema();

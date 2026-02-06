import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { BundleItemWhereUniqueInputObjectSchema as BundleItemWhereUniqueInputObjectSchema } from './BundleItemWhereUniqueInput.schema';
import { BundleItemCreateWithoutProductInputObjectSchema as BundleItemCreateWithoutProductInputObjectSchema } from './BundleItemCreateWithoutProductInput.schema';
import { BundleItemUncheckedCreateWithoutProductInputObjectSchema as BundleItemUncheckedCreateWithoutProductInputObjectSchema } from './BundleItemUncheckedCreateWithoutProductInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => BundleItemWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => BundleItemCreateWithoutProductInputObjectSchema), z.lazy(() => BundleItemUncheckedCreateWithoutProductInputObjectSchema)])
}).strict();
export const BundleItemCreateOrConnectWithoutProductInputObjectSchema: z.ZodType<Prisma.BundleItemCreateOrConnectWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.BundleItemCreateOrConnectWithoutProductInput>;
export const BundleItemCreateOrConnectWithoutProductInputObjectZodSchema = makeSchema();

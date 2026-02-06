import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { BundleItemCreateWithoutProductInputObjectSchema as BundleItemCreateWithoutProductInputObjectSchema } from './BundleItemCreateWithoutProductInput.schema';
import { BundleItemUncheckedCreateWithoutProductInputObjectSchema as BundleItemUncheckedCreateWithoutProductInputObjectSchema } from './BundleItemUncheckedCreateWithoutProductInput.schema';
import { BundleItemCreateOrConnectWithoutProductInputObjectSchema as BundleItemCreateOrConnectWithoutProductInputObjectSchema } from './BundleItemCreateOrConnectWithoutProductInput.schema';
import { BundleItemCreateManyProductInputEnvelopeObjectSchema as BundleItemCreateManyProductInputEnvelopeObjectSchema } from './BundleItemCreateManyProductInputEnvelope.schema';
import { BundleItemWhereUniqueInputObjectSchema as BundleItemWhereUniqueInputObjectSchema } from './BundleItemWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => BundleItemCreateWithoutProductInputObjectSchema), z.lazy(() => BundleItemCreateWithoutProductInputObjectSchema).array(), z.lazy(() => BundleItemUncheckedCreateWithoutProductInputObjectSchema), z.lazy(() => BundleItemUncheckedCreateWithoutProductInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => BundleItemCreateOrConnectWithoutProductInputObjectSchema), z.lazy(() => BundleItemCreateOrConnectWithoutProductInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => BundleItemCreateManyProductInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => BundleItemWhereUniqueInputObjectSchema), z.lazy(() => BundleItemWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const BundleItemUncheckedCreateNestedManyWithoutProductInputObjectSchema: z.ZodType<Prisma.BundleItemUncheckedCreateNestedManyWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.BundleItemUncheckedCreateNestedManyWithoutProductInput>;
export const BundleItemUncheckedCreateNestedManyWithoutProductInputObjectZodSchema = makeSchema();

import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { BundleItemCreateWithoutBundleInputObjectSchema as BundleItemCreateWithoutBundleInputObjectSchema } from './BundleItemCreateWithoutBundleInput.schema';
import { BundleItemUncheckedCreateWithoutBundleInputObjectSchema as BundleItemUncheckedCreateWithoutBundleInputObjectSchema } from './BundleItemUncheckedCreateWithoutBundleInput.schema';
import { BundleItemCreateOrConnectWithoutBundleInputObjectSchema as BundleItemCreateOrConnectWithoutBundleInputObjectSchema } from './BundleItemCreateOrConnectWithoutBundleInput.schema';
import { BundleItemCreateManyBundleInputEnvelopeObjectSchema as BundleItemCreateManyBundleInputEnvelopeObjectSchema } from './BundleItemCreateManyBundleInputEnvelope.schema';
import { BundleItemWhereUniqueInputObjectSchema as BundleItemWhereUniqueInputObjectSchema } from './BundleItemWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => BundleItemCreateWithoutBundleInputObjectSchema), z.lazy(() => BundleItemCreateWithoutBundleInputObjectSchema).array(), z.lazy(() => BundleItemUncheckedCreateWithoutBundleInputObjectSchema), z.lazy(() => BundleItemUncheckedCreateWithoutBundleInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => BundleItemCreateOrConnectWithoutBundleInputObjectSchema), z.lazy(() => BundleItemCreateOrConnectWithoutBundleInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => BundleItemCreateManyBundleInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => BundleItemWhereUniqueInputObjectSchema), z.lazy(() => BundleItemWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const BundleItemUncheckedCreateNestedManyWithoutBundleInputObjectSchema: z.ZodType<Prisma.BundleItemUncheckedCreateNestedManyWithoutBundleInput> = makeSchema() as unknown as z.ZodType<Prisma.BundleItemUncheckedCreateNestedManyWithoutBundleInput>;
export const BundleItemUncheckedCreateNestedManyWithoutBundleInputObjectZodSchema = makeSchema();

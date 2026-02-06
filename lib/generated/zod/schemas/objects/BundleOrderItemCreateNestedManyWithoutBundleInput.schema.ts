import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { BundleOrderItemCreateWithoutBundleInputObjectSchema as BundleOrderItemCreateWithoutBundleInputObjectSchema } from './BundleOrderItemCreateWithoutBundleInput.schema';
import { BundleOrderItemUncheckedCreateWithoutBundleInputObjectSchema as BundleOrderItemUncheckedCreateWithoutBundleInputObjectSchema } from './BundleOrderItemUncheckedCreateWithoutBundleInput.schema';
import { BundleOrderItemCreateOrConnectWithoutBundleInputObjectSchema as BundleOrderItemCreateOrConnectWithoutBundleInputObjectSchema } from './BundleOrderItemCreateOrConnectWithoutBundleInput.schema';
import { BundleOrderItemCreateManyBundleInputEnvelopeObjectSchema as BundleOrderItemCreateManyBundleInputEnvelopeObjectSchema } from './BundleOrderItemCreateManyBundleInputEnvelope.schema';
import { BundleOrderItemWhereUniqueInputObjectSchema as BundleOrderItemWhereUniqueInputObjectSchema } from './BundleOrderItemWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => BundleOrderItemCreateWithoutBundleInputObjectSchema), z.lazy(() => BundleOrderItemCreateWithoutBundleInputObjectSchema).array(), z.lazy(() => BundleOrderItemUncheckedCreateWithoutBundleInputObjectSchema), z.lazy(() => BundleOrderItemUncheckedCreateWithoutBundleInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => BundleOrderItemCreateOrConnectWithoutBundleInputObjectSchema), z.lazy(() => BundleOrderItemCreateOrConnectWithoutBundleInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => BundleOrderItemCreateManyBundleInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => BundleOrderItemWhereUniqueInputObjectSchema), z.lazy(() => BundleOrderItemWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const BundleOrderItemCreateNestedManyWithoutBundleInputObjectSchema: z.ZodType<Prisma.BundleOrderItemCreateNestedManyWithoutBundleInput> = makeSchema() as unknown as z.ZodType<Prisma.BundleOrderItemCreateNestedManyWithoutBundleInput>;
export const BundleOrderItemCreateNestedManyWithoutBundleInputObjectZodSchema = makeSchema();

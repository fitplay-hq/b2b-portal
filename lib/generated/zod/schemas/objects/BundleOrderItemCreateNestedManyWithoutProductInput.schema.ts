import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { BundleOrderItemCreateWithoutProductInputObjectSchema as BundleOrderItemCreateWithoutProductInputObjectSchema } from './BundleOrderItemCreateWithoutProductInput.schema';
import { BundleOrderItemUncheckedCreateWithoutProductInputObjectSchema as BundleOrderItemUncheckedCreateWithoutProductInputObjectSchema } from './BundleOrderItemUncheckedCreateWithoutProductInput.schema';
import { BundleOrderItemCreateOrConnectWithoutProductInputObjectSchema as BundleOrderItemCreateOrConnectWithoutProductInputObjectSchema } from './BundleOrderItemCreateOrConnectWithoutProductInput.schema';
import { BundleOrderItemCreateManyProductInputEnvelopeObjectSchema as BundleOrderItemCreateManyProductInputEnvelopeObjectSchema } from './BundleOrderItemCreateManyProductInputEnvelope.schema';
import { BundleOrderItemWhereUniqueInputObjectSchema as BundleOrderItemWhereUniqueInputObjectSchema } from './BundleOrderItemWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => BundleOrderItemCreateWithoutProductInputObjectSchema), z.lazy(() => BundleOrderItemCreateWithoutProductInputObjectSchema).array(), z.lazy(() => BundleOrderItemUncheckedCreateWithoutProductInputObjectSchema), z.lazy(() => BundleOrderItemUncheckedCreateWithoutProductInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => BundleOrderItemCreateOrConnectWithoutProductInputObjectSchema), z.lazy(() => BundleOrderItemCreateOrConnectWithoutProductInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => BundleOrderItemCreateManyProductInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => BundleOrderItemWhereUniqueInputObjectSchema), z.lazy(() => BundleOrderItemWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const BundleOrderItemCreateNestedManyWithoutProductInputObjectSchema: z.ZodType<Prisma.BundleOrderItemCreateNestedManyWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.BundleOrderItemCreateNestedManyWithoutProductInput>;
export const BundleOrderItemCreateNestedManyWithoutProductInputObjectZodSchema = makeSchema();

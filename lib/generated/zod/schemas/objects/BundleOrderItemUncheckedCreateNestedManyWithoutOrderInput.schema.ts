import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { BundleOrderItemCreateWithoutOrderInputObjectSchema as BundleOrderItemCreateWithoutOrderInputObjectSchema } from './BundleOrderItemCreateWithoutOrderInput.schema';
import { BundleOrderItemUncheckedCreateWithoutOrderInputObjectSchema as BundleOrderItemUncheckedCreateWithoutOrderInputObjectSchema } from './BundleOrderItemUncheckedCreateWithoutOrderInput.schema';
import { BundleOrderItemCreateOrConnectWithoutOrderInputObjectSchema as BundleOrderItemCreateOrConnectWithoutOrderInputObjectSchema } from './BundleOrderItemCreateOrConnectWithoutOrderInput.schema';
import { BundleOrderItemCreateManyOrderInputEnvelopeObjectSchema as BundleOrderItemCreateManyOrderInputEnvelopeObjectSchema } from './BundleOrderItemCreateManyOrderInputEnvelope.schema';
import { BundleOrderItemWhereUniqueInputObjectSchema as BundleOrderItemWhereUniqueInputObjectSchema } from './BundleOrderItemWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => BundleOrderItemCreateWithoutOrderInputObjectSchema), z.lazy(() => BundleOrderItemCreateWithoutOrderInputObjectSchema).array(), z.lazy(() => BundleOrderItemUncheckedCreateWithoutOrderInputObjectSchema), z.lazy(() => BundleOrderItemUncheckedCreateWithoutOrderInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => BundleOrderItemCreateOrConnectWithoutOrderInputObjectSchema), z.lazy(() => BundleOrderItemCreateOrConnectWithoutOrderInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => BundleOrderItemCreateManyOrderInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => BundleOrderItemWhereUniqueInputObjectSchema), z.lazy(() => BundleOrderItemWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const BundleOrderItemUncheckedCreateNestedManyWithoutOrderInputObjectSchema: z.ZodType<Prisma.BundleOrderItemUncheckedCreateNestedManyWithoutOrderInput> = makeSchema() as unknown as z.ZodType<Prisma.BundleOrderItemUncheckedCreateNestedManyWithoutOrderInput>;
export const BundleOrderItemUncheckedCreateNestedManyWithoutOrderInputObjectZodSchema = makeSchema();

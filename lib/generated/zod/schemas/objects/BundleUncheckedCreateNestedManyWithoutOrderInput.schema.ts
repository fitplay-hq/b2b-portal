import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { BundleCreateWithoutOrderInputObjectSchema as BundleCreateWithoutOrderInputObjectSchema } from './BundleCreateWithoutOrderInput.schema';
import { BundleUncheckedCreateWithoutOrderInputObjectSchema as BundleUncheckedCreateWithoutOrderInputObjectSchema } from './BundleUncheckedCreateWithoutOrderInput.schema';
import { BundleCreateOrConnectWithoutOrderInputObjectSchema as BundleCreateOrConnectWithoutOrderInputObjectSchema } from './BundleCreateOrConnectWithoutOrderInput.schema';
import { BundleCreateManyOrderInputEnvelopeObjectSchema as BundleCreateManyOrderInputEnvelopeObjectSchema } from './BundleCreateManyOrderInputEnvelope.schema';
import { BundleWhereUniqueInputObjectSchema as BundleWhereUniqueInputObjectSchema } from './BundleWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => BundleCreateWithoutOrderInputObjectSchema), z.lazy(() => BundleCreateWithoutOrderInputObjectSchema).array(), z.lazy(() => BundleUncheckedCreateWithoutOrderInputObjectSchema), z.lazy(() => BundleUncheckedCreateWithoutOrderInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => BundleCreateOrConnectWithoutOrderInputObjectSchema), z.lazy(() => BundleCreateOrConnectWithoutOrderInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => BundleCreateManyOrderInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => BundleWhereUniqueInputObjectSchema), z.lazy(() => BundleWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const BundleUncheckedCreateNestedManyWithoutOrderInputObjectSchema: z.ZodType<Prisma.BundleUncheckedCreateNestedManyWithoutOrderInput> = makeSchema() as unknown as z.ZodType<Prisma.BundleUncheckedCreateNestedManyWithoutOrderInput>;
export const BundleUncheckedCreateNestedManyWithoutOrderInputObjectZodSchema = makeSchema();

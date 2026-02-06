import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { BundleCreateWithoutOrderInputObjectSchema as BundleCreateWithoutOrderInputObjectSchema } from './BundleCreateWithoutOrderInput.schema';
import { BundleUncheckedCreateWithoutOrderInputObjectSchema as BundleUncheckedCreateWithoutOrderInputObjectSchema } from './BundleUncheckedCreateWithoutOrderInput.schema';
import { BundleCreateOrConnectWithoutOrderInputObjectSchema as BundleCreateOrConnectWithoutOrderInputObjectSchema } from './BundleCreateOrConnectWithoutOrderInput.schema';
import { BundleUpsertWithWhereUniqueWithoutOrderInputObjectSchema as BundleUpsertWithWhereUniqueWithoutOrderInputObjectSchema } from './BundleUpsertWithWhereUniqueWithoutOrderInput.schema';
import { BundleCreateManyOrderInputEnvelopeObjectSchema as BundleCreateManyOrderInputEnvelopeObjectSchema } from './BundleCreateManyOrderInputEnvelope.schema';
import { BundleWhereUniqueInputObjectSchema as BundleWhereUniqueInputObjectSchema } from './BundleWhereUniqueInput.schema';
import { BundleUpdateWithWhereUniqueWithoutOrderInputObjectSchema as BundleUpdateWithWhereUniqueWithoutOrderInputObjectSchema } from './BundleUpdateWithWhereUniqueWithoutOrderInput.schema';
import { BundleUpdateManyWithWhereWithoutOrderInputObjectSchema as BundleUpdateManyWithWhereWithoutOrderInputObjectSchema } from './BundleUpdateManyWithWhereWithoutOrderInput.schema';
import { BundleScalarWhereInputObjectSchema as BundleScalarWhereInputObjectSchema } from './BundleScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => BundleCreateWithoutOrderInputObjectSchema), z.lazy(() => BundleCreateWithoutOrderInputObjectSchema).array(), z.lazy(() => BundleUncheckedCreateWithoutOrderInputObjectSchema), z.lazy(() => BundleUncheckedCreateWithoutOrderInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => BundleCreateOrConnectWithoutOrderInputObjectSchema), z.lazy(() => BundleCreateOrConnectWithoutOrderInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => BundleUpsertWithWhereUniqueWithoutOrderInputObjectSchema), z.lazy(() => BundleUpsertWithWhereUniqueWithoutOrderInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => BundleCreateManyOrderInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => BundleWhereUniqueInputObjectSchema), z.lazy(() => BundleWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => BundleWhereUniqueInputObjectSchema), z.lazy(() => BundleWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => BundleWhereUniqueInputObjectSchema), z.lazy(() => BundleWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => BundleWhereUniqueInputObjectSchema), z.lazy(() => BundleWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => BundleUpdateWithWhereUniqueWithoutOrderInputObjectSchema), z.lazy(() => BundleUpdateWithWhereUniqueWithoutOrderInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => BundleUpdateManyWithWhereWithoutOrderInputObjectSchema), z.lazy(() => BundleUpdateManyWithWhereWithoutOrderInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => BundleScalarWhereInputObjectSchema), z.lazy(() => BundleScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const BundleUncheckedUpdateManyWithoutOrderNestedInputObjectSchema: z.ZodType<Prisma.BundleUncheckedUpdateManyWithoutOrderNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.BundleUncheckedUpdateManyWithoutOrderNestedInput>;
export const BundleUncheckedUpdateManyWithoutOrderNestedInputObjectZodSchema = makeSchema();

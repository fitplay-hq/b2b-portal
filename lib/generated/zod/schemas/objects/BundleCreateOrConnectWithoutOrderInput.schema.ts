import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { BundleWhereUniqueInputObjectSchema as BundleWhereUniqueInputObjectSchema } from './BundleWhereUniqueInput.schema';
import { BundleCreateWithoutOrderInputObjectSchema as BundleCreateWithoutOrderInputObjectSchema } from './BundleCreateWithoutOrderInput.schema';
import { BundleUncheckedCreateWithoutOrderInputObjectSchema as BundleUncheckedCreateWithoutOrderInputObjectSchema } from './BundleUncheckedCreateWithoutOrderInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => BundleWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => BundleCreateWithoutOrderInputObjectSchema), z.lazy(() => BundleUncheckedCreateWithoutOrderInputObjectSchema)])
}).strict();
export const BundleCreateOrConnectWithoutOrderInputObjectSchema: z.ZodType<Prisma.BundleCreateOrConnectWithoutOrderInput> = makeSchema() as unknown as z.ZodType<Prisma.BundleCreateOrConnectWithoutOrderInput>;
export const BundleCreateOrConnectWithoutOrderInputObjectZodSchema = makeSchema();

import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { BundleScalarWhereInputObjectSchema as BundleScalarWhereInputObjectSchema } from './BundleScalarWhereInput.schema';
import { BundleUpdateManyMutationInputObjectSchema as BundleUpdateManyMutationInputObjectSchema } from './BundleUpdateManyMutationInput.schema';
import { BundleUncheckedUpdateManyWithoutOrderInputObjectSchema as BundleUncheckedUpdateManyWithoutOrderInputObjectSchema } from './BundleUncheckedUpdateManyWithoutOrderInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => BundleScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => BundleUpdateManyMutationInputObjectSchema), z.lazy(() => BundleUncheckedUpdateManyWithoutOrderInputObjectSchema)])
}).strict();
export const BundleUpdateManyWithWhereWithoutOrderInputObjectSchema: z.ZodType<Prisma.BundleUpdateManyWithWhereWithoutOrderInput> = makeSchema() as unknown as z.ZodType<Prisma.BundleUpdateManyWithWhereWithoutOrderInput>;
export const BundleUpdateManyWithWhereWithoutOrderInputObjectZodSchema = makeSchema();

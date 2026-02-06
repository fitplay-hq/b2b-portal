import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { OrderCreateNestedOneWithoutBundlesInputObjectSchema as OrderCreateNestedOneWithoutBundlesInputObjectSchema } from './OrderCreateNestedOneWithoutBundlesInput.schema';
import { BundleItemCreateNestedManyWithoutBundleInputObjectSchema as BundleItemCreateNestedManyWithoutBundleInputObjectSchema } from './BundleItemCreateNestedManyWithoutBundleInput.schema';
import { BundleOrderItemCreateNestedManyWithoutBundleInputObjectSchema as BundleOrderItemCreateNestedManyWithoutBundleInputObjectSchema } from './BundleOrderItemCreateNestedManyWithoutBundleInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  price: z.number().optional().nullable(),
  numberOfBundles: z.number().int().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  order: z.lazy(() => OrderCreateNestedOneWithoutBundlesInputObjectSchema).optional(),
  items: z.lazy(() => BundleItemCreateNestedManyWithoutBundleInputObjectSchema).optional(),
  bundleOrderItems: z.lazy(() => BundleOrderItemCreateNestedManyWithoutBundleInputObjectSchema).optional()
}).strict();
export const BundleCreateInputObjectSchema: z.ZodType<Prisma.BundleCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.BundleCreateInput>;
export const BundleCreateInputObjectZodSchema = makeSchema();

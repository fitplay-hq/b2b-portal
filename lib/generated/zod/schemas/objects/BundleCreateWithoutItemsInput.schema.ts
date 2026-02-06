import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { OrderCreateNestedOneWithoutBundlesInputObjectSchema as OrderCreateNestedOneWithoutBundlesInputObjectSchema } from './OrderCreateNestedOneWithoutBundlesInput.schema';
import { BundleOrderItemCreateNestedManyWithoutBundleInputObjectSchema as BundleOrderItemCreateNestedManyWithoutBundleInputObjectSchema } from './BundleOrderItemCreateNestedManyWithoutBundleInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  price: z.number().optional().nullable(),
  numberOfBundles: z.number().int().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  order: z.lazy(() => OrderCreateNestedOneWithoutBundlesInputObjectSchema).optional(),
  bundleOrderItems: z.lazy(() => BundleOrderItemCreateNestedManyWithoutBundleInputObjectSchema).optional()
}).strict();
export const BundleCreateWithoutItemsInputObjectSchema: z.ZodType<Prisma.BundleCreateWithoutItemsInput> = makeSchema() as unknown as z.ZodType<Prisma.BundleCreateWithoutItemsInput>;
export const BundleCreateWithoutItemsInputObjectZodSchema = makeSchema();

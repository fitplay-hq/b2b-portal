import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { IntFilterObjectSchema as IntFilterObjectSchema } from './IntFilter.schema';
import { FloatFilterObjectSchema as FloatFilterObjectSchema } from './FloatFilter.schema'

const bundleorderitemscalarwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => BundleOrderItemScalarWhereInputObjectSchema), z.lazy(() => BundleOrderItemScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => BundleOrderItemScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => BundleOrderItemScalarWhereInputObjectSchema), z.lazy(() => BundleOrderItemScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  bundleId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  orderId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  productId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  quantity: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  price: z.union([z.lazy(() => FloatFilterObjectSchema), z.number()]).optional()
}).strict();
export const BundleOrderItemScalarWhereInputObjectSchema: z.ZodType<Prisma.BundleOrderItemScalarWhereInput> = bundleorderitemscalarwhereinputSchema as unknown as z.ZodType<Prisma.BundleOrderItemScalarWhereInput>;
export const BundleOrderItemScalarWhereInputObjectZodSchema = bundleorderitemscalarwhereinputSchema;

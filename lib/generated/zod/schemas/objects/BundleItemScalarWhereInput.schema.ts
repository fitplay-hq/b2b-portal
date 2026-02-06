import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { IntFilterObjectSchema as IntFilterObjectSchema } from './IntFilter.schema';
import { FloatFilterObjectSchema as FloatFilterObjectSchema } from './FloatFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema'

const bundleitemscalarwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => BundleItemScalarWhereInputObjectSchema), z.lazy(() => BundleItemScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => BundleItemScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => BundleItemScalarWhereInputObjectSchema), z.lazy(() => BundleItemScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  bundleId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  productId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  bundleProductQuantity: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  price: z.union([z.lazy(() => FloatFilterObjectSchema), z.number()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const BundleItemScalarWhereInputObjectSchema: z.ZodType<Prisma.BundleItemScalarWhereInput> = bundleitemscalarwhereinputSchema as unknown as z.ZodType<Prisma.BundleItemScalarWhereInput>;
export const BundleItemScalarWhereInputObjectZodSchema = bundleitemscalarwhereinputSchema;

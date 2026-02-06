import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ProductCategoryArgsObjectSchema as ProductCategoryArgsObjectSchema } from './ProductCategoryArgs.schema';
import { SubCategoryArgsObjectSchema as SubCategoryArgsObjectSchema } from './SubCategoryArgs.schema';
import { CompanyFindManySchema as CompanyFindManySchema } from '../findManyCompany.schema';
import { ClientProductFindManySchema as ClientProductFindManySchema } from '../findManyClientProduct.schema';
import { OrderItemFindManySchema as OrderItemFindManySchema } from '../findManyOrderItem.schema';
import { BundleOrderItemFindManySchema as BundleOrderItemFindManySchema } from '../findManyBundleOrderItem.schema';
import { BundleItemFindManySchema as BundleItemFindManySchema } from '../findManyBundleItem.schema';
import { ProductCountOutputTypeArgsObjectSchema as ProductCountOutputTypeArgsObjectSchema } from './ProductCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  category: z.union([z.boolean(), z.lazy(() => ProductCategoryArgsObjectSchema)]).optional(),
  subCategory: z.union([z.boolean(), z.lazy(() => SubCategoryArgsObjectSchema)]).optional(),
  companies: z.union([z.boolean(), z.lazy(() => CompanyFindManySchema)]).optional(),
  clients: z.union([z.boolean(), z.lazy(() => ClientProductFindManySchema)]).optional(),
  orderItems: z.union([z.boolean(), z.lazy(() => OrderItemFindManySchema)]).optional(),
  bundleOrderItems: z.union([z.boolean(), z.lazy(() => BundleOrderItemFindManySchema)]).optional(),
  bundleItems: z.union([z.boolean(), z.lazy(() => BundleItemFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => ProductCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const ProductIncludeObjectSchema: z.ZodType<Prisma.ProductInclude> = makeSchema() as unknown as z.ZodType<Prisma.ProductInclude>;
export const ProductIncludeObjectZodSchema = makeSchema();

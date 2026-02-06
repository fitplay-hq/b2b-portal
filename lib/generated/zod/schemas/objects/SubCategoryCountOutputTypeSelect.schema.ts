import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SubCategoryCountOutputTypeCountProductsArgsObjectSchema as SubCategoryCountOutputTypeCountProductsArgsObjectSchema } from './SubCategoryCountOutputTypeCountProductsArgs.schema'

const makeSchema = () => z.object({
  products: z.union([z.boolean(), z.lazy(() => SubCategoryCountOutputTypeCountProductsArgsObjectSchema)]).optional()
}).strict();
export const SubCategoryCountOutputTypeSelectObjectSchema: z.ZodType<Prisma.SubCategoryCountOutputTypeSelect> = makeSchema() as unknown as z.ZodType<Prisma.SubCategoryCountOutputTypeSelect>;
export const SubCategoryCountOutputTypeSelectObjectZodSchema = makeSchema();

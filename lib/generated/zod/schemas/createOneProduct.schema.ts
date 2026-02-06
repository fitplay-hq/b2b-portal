import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { ProductSelectObjectSchema as ProductSelectObjectSchema } from './objects/ProductSelect.schema';
import { ProductIncludeObjectSchema as ProductIncludeObjectSchema } from './objects/ProductInclude.schema';
import { ProductCreateInputObjectSchema as ProductCreateInputObjectSchema } from './objects/ProductCreateInput.schema';
import { ProductUncheckedCreateInputObjectSchema as ProductUncheckedCreateInputObjectSchema } from './objects/ProductUncheckedCreateInput.schema';

export const ProductCreateOneSchema: z.ZodType<Prisma.ProductCreateArgs> = z.object({ select: ProductSelectObjectSchema.optional(), include: ProductIncludeObjectSchema.optional(), data: z.union([ProductCreateInputObjectSchema, ProductUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.ProductCreateArgs>;

export const ProductCreateOneZodSchema = z.object({ select: ProductSelectObjectSchema.optional(), include: ProductIncludeObjectSchema.optional(), data: z.union([ProductCreateInputObjectSchema, ProductUncheckedCreateInputObjectSchema]) }).strict();
import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { CompanyWhereUniqueInputObjectSchema as CompanyWhereUniqueInputObjectSchema } from './CompanyWhereUniqueInput.schema';
import { CompanyUpdateWithoutProductsInputObjectSchema as CompanyUpdateWithoutProductsInputObjectSchema } from './CompanyUpdateWithoutProductsInput.schema';
import { CompanyUncheckedUpdateWithoutProductsInputObjectSchema as CompanyUncheckedUpdateWithoutProductsInputObjectSchema } from './CompanyUncheckedUpdateWithoutProductsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => CompanyWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => CompanyUpdateWithoutProductsInputObjectSchema), z.lazy(() => CompanyUncheckedUpdateWithoutProductsInputObjectSchema)])
}).strict();
export const CompanyUpdateWithWhereUniqueWithoutProductsInputObjectSchema: z.ZodType<Prisma.CompanyUpdateWithWhereUniqueWithoutProductsInput> = makeSchema() as unknown as z.ZodType<Prisma.CompanyUpdateWithWhereUniqueWithoutProductsInput>;
export const CompanyUpdateWithWhereUniqueWithoutProductsInputObjectZodSchema = makeSchema();

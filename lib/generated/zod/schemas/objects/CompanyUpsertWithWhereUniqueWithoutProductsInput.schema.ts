import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { CompanyWhereUniqueInputObjectSchema as CompanyWhereUniqueInputObjectSchema } from './CompanyWhereUniqueInput.schema';
import { CompanyUpdateWithoutProductsInputObjectSchema as CompanyUpdateWithoutProductsInputObjectSchema } from './CompanyUpdateWithoutProductsInput.schema';
import { CompanyUncheckedUpdateWithoutProductsInputObjectSchema as CompanyUncheckedUpdateWithoutProductsInputObjectSchema } from './CompanyUncheckedUpdateWithoutProductsInput.schema';
import { CompanyCreateWithoutProductsInputObjectSchema as CompanyCreateWithoutProductsInputObjectSchema } from './CompanyCreateWithoutProductsInput.schema';
import { CompanyUncheckedCreateWithoutProductsInputObjectSchema as CompanyUncheckedCreateWithoutProductsInputObjectSchema } from './CompanyUncheckedCreateWithoutProductsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => CompanyWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => CompanyUpdateWithoutProductsInputObjectSchema), z.lazy(() => CompanyUncheckedUpdateWithoutProductsInputObjectSchema)]),
  create: z.union([z.lazy(() => CompanyCreateWithoutProductsInputObjectSchema), z.lazy(() => CompanyUncheckedCreateWithoutProductsInputObjectSchema)])
}).strict();
export const CompanyUpsertWithWhereUniqueWithoutProductsInputObjectSchema: z.ZodType<Prisma.CompanyUpsertWithWhereUniqueWithoutProductsInput> = makeSchema() as unknown as z.ZodType<Prisma.CompanyUpsertWithWhereUniqueWithoutProductsInput>;
export const CompanyUpsertWithWhereUniqueWithoutProductsInputObjectZodSchema = makeSchema();

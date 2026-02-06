import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { CompanyWhereUniqueInputObjectSchema as CompanyWhereUniqueInputObjectSchema } from './CompanyWhereUniqueInput.schema';
import { CompanyCreateWithoutProductsInputObjectSchema as CompanyCreateWithoutProductsInputObjectSchema } from './CompanyCreateWithoutProductsInput.schema';
import { CompanyUncheckedCreateWithoutProductsInputObjectSchema as CompanyUncheckedCreateWithoutProductsInputObjectSchema } from './CompanyUncheckedCreateWithoutProductsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => CompanyWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => CompanyCreateWithoutProductsInputObjectSchema), z.lazy(() => CompanyUncheckedCreateWithoutProductsInputObjectSchema)])
}).strict();
export const CompanyCreateOrConnectWithoutProductsInputObjectSchema: z.ZodType<Prisma.CompanyCreateOrConnectWithoutProductsInput> = makeSchema() as unknown as z.ZodType<Prisma.CompanyCreateOrConnectWithoutProductsInput>;
export const CompanyCreateOrConnectWithoutProductsInputObjectZodSchema = makeSchema();

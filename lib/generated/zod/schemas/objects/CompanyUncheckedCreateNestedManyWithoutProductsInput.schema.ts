import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { CompanyCreateWithoutProductsInputObjectSchema as CompanyCreateWithoutProductsInputObjectSchema } from './CompanyCreateWithoutProductsInput.schema';
import { CompanyUncheckedCreateWithoutProductsInputObjectSchema as CompanyUncheckedCreateWithoutProductsInputObjectSchema } from './CompanyUncheckedCreateWithoutProductsInput.schema';
import { CompanyCreateOrConnectWithoutProductsInputObjectSchema as CompanyCreateOrConnectWithoutProductsInputObjectSchema } from './CompanyCreateOrConnectWithoutProductsInput.schema';
import { CompanyWhereUniqueInputObjectSchema as CompanyWhereUniqueInputObjectSchema } from './CompanyWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => CompanyCreateWithoutProductsInputObjectSchema), z.lazy(() => CompanyCreateWithoutProductsInputObjectSchema).array(), z.lazy(() => CompanyUncheckedCreateWithoutProductsInputObjectSchema), z.lazy(() => CompanyUncheckedCreateWithoutProductsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => CompanyCreateOrConnectWithoutProductsInputObjectSchema), z.lazy(() => CompanyCreateOrConnectWithoutProductsInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => CompanyWhereUniqueInputObjectSchema), z.lazy(() => CompanyWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const CompanyUncheckedCreateNestedManyWithoutProductsInputObjectSchema: z.ZodType<Prisma.CompanyUncheckedCreateNestedManyWithoutProductsInput> = makeSchema() as unknown as z.ZodType<Prisma.CompanyUncheckedCreateNestedManyWithoutProductsInput>;
export const CompanyUncheckedCreateNestedManyWithoutProductsInputObjectZodSchema = makeSchema();

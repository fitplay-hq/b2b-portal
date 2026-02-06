import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { CompanyScalarWhereInputObjectSchema as CompanyScalarWhereInputObjectSchema } from './CompanyScalarWhereInput.schema';
import { CompanyUpdateManyMutationInputObjectSchema as CompanyUpdateManyMutationInputObjectSchema } from './CompanyUpdateManyMutationInput.schema';
import { CompanyUncheckedUpdateManyWithoutProductsInputObjectSchema as CompanyUncheckedUpdateManyWithoutProductsInputObjectSchema } from './CompanyUncheckedUpdateManyWithoutProductsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => CompanyScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => CompanyUpdateManyMutationInputObjectSchema), z.lazy(() => CompanyUncheckedUpdateManyWithoutProductsInputObjectSchema)])
}).strict();
export const CompanyUpdateManyWithWhereWithoutProductsInputObjectSchema: z.ZodType<Prisma.CompanyUpdateManyWithWhereWithoutProductsInput> = makeSchema() as unknown as z.ZodType<Prisma.CompanyUpdateManyWithWhereWithoutProductsInput>;
export const CompanyUpdateManyWithWhereWithoutProductsInputObjectZodSchema = makeSchema();

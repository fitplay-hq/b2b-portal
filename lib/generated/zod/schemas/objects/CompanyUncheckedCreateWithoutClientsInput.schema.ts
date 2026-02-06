import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ProductUncheckedCreateNestedManyWithoutCompaniesInputObjectSchema as ProductUncheckedCreateNestedManyWithoutCompaniesInputObjectSchema } from './ProductUncheckedCreateNestedManyWithoutCompaniesInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string(),
  address: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  products: z.lazy(() => ProductUncheckedCreateNestedManyWithoutCompaniesInputObjectSchema).optional()
}).strict();
export const CompanyUncheckedCreateWithoutClientsInputObjectSchema: z.ZodType<Prisma.CompanyUncheckedCreateWithoutClientsInput> = makeSchema() as unknown as z.ZodType<Prisma.CompanyUncheckedCreateWithoutClientsInput>;
export const CompanyUncheckedCreateWithoutClientsInputObjectZodSchema = makeSchema();

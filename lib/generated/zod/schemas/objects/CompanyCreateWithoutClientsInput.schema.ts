import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ProductCreateNestedManyWithoutCompaniesInputObjectSchema as ProductCreateNestedManyWithoutCompaniesInputObjectSchema } from './ProductCreateNestedManyWithoutCompaniesInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string().max(50),
  address: z.string().max(100),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  products: z.lazy(() => ProductCreateNestedManyWithoutCompaniesInputObjectSchema).optional()
}).strict();
export const CompanyCreateWithoutClientsInputObjectSchema: z.ZodType<Prisma.CompanyCreateWithoutClientsInput> = makeSchema() as unknown as z.ZodType<Prisma.CompanyCreateWithoutClientsInput>;
export const CompanyCreateWithoutClientsInputObjectZodSchema = makeSchema();

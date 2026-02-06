import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ProductCreateNestedManyWithoutCompaniesInputObjectSchema as ProductCreateNestedManyWithoutCompaniesInputObjectSchema } from './ProductCreateNestedManyWithoutCompaniesInput.schema';
import { ClientCreateNestedManyWithoutCompanyInputObjectSchema as ClientCreateNestedManyWithoutCompanyInputObjectSchema } from './ClientCreateNestedManyWithoutCompanyInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string().max(50),
  address: z.string().max(100),
  createdAt: z.coerce.date().optional(),
  products: z.lazy(() => ProductCreateNestedManyWithoutCompaniesInputObjectSchema).optional(),
  clients: z.lazy(() => ClientCreateNestedManyWithoutCompanyInputObjectSchema).optional()
}).strict();
export const CompanyCreateInputObjectSchema: z.ZodType<Prisma.CompanyCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.CompanyCreateInput>;
export const CompanyCreateInputObjectZodSchema = makeSchema();

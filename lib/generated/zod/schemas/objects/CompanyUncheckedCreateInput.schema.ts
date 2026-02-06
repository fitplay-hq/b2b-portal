import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ProductUncheckedCreateNestedManyWithoutCompaniesInputObjectSchema as ProductUncheckedCreateNestedManyWithoutCompaniesInputObjectSchema } from './ProductUncheckedCreateNestedManyWithoutCompaniesInput.schema';
import { ClientUncheckedCreateNestedManyWithoutCompanyInputObjectSchema as ClientUncheckedCreateNestedManyWithoutCompanyInputObjectSchema } from './ClientUncheckedCreateNestedManyWithoutCompanyInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string().max(50),
  address: z.string().max(100),
  createdAt: z.coerce.date().optional(),
  products: z.lazy(() => ProductUncheckedCreateNestedManyWithoutCompaniesInputObjectSchema).optional(),
  clients: z.lazy(() => ClientUncheckedCreateNestedManyWithoutCompanyInputObjectSchema).optional()
}).strict();
export const CompanyUncheckedCreateInputObjectSchema: z.ZodType<Prisma.CompanyUncheckedCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.CompanyUncheckedCreateInput>;
export const CompanyUncheckedCreateInputObjectZodSchema = makeSchema();

import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ClientUncheckedCreateNestedManyWithoutCompanyInputObjectSchema as ClientUncheckedCreateNestedManyWithoutCompanyInputObjectSchema } from './ClientUncheckedCreateNestedManyWithoutCompanyInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string(),
  address: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  clients: z.lazy(() => ClientUncheckedCreateNestedManyWithoutCompanyInputObjectSchema).optional()
}).strict();
export const CompanyUncheckedCreateWithoutProductsInputObjectSchema: z.ZodType<Prisma.CompanyUncheckedCreateWithoutProductsInput> = makeSchema() as unknown as z.ZodType<Prisma.CompanyUncheckedCreateWithoutProductsInput>;
export const CompanyUncheckedCreateWithoutProductsInputObjectZodSchema = makeSchema();

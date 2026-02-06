import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ClientCreateNestedManyWithoutCompanyInputObjectSchema as ClientCreateNestedManyWithoutCompanyInputObjectSchema } from './ClientCreateNestedManyWithoutCompanyInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string().max(50),
  address: z.string().max(100),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  clients: z.lazy(() => ClientCreateNestedManyWithoutCompanyInputObjectSchema).optional()
}).strict();
export const CompanyCreateWithoutProductsInputObjectSchema: z.ZodType<Prisma.CompanyCreateWithoutProductsInput> = makeSchema() as unknown as z.ZodType<Prisma.CompanyCreateWithoutProductsInput>;
export const CompanyCreateWithoutProductsInputObjectZodSchema = makeSchema();

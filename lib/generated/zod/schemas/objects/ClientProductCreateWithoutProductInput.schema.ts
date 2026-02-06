import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ClientCreateNestedOneWithoutProductsInputObjectSchema as ClientCreateNestedOneWithoutProductsInputObjectSchema } from './ClientCreateNestedOneWithoutProductsInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  client: z.lazy(() => ClientCreateNestedOneWithoutProductsInputObjectSchema)
}).strict();
export const ClientProductCreateWithoutProductInputObjectSchema: z.ZodType<Prisma.ClientProductCreateWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.ClientProductCreateWithoutProductInput>;
export const ClientProductCreateWithoutProductInputObjectZodSchema = makeSchema();

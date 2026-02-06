import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ProductCreateNestedOneWithoutClientsInputObjectSchema as ProductCreateNestedOneWithoutClientsInputObjectSchema } from './ProductCreateNestedOneWithoutClientsInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  product: z.lazy(() => ProductCreateNestedOneWithoutClientsInputObjectSchema)
}).strict();
export const ClientProductCreateWithoutClientInputObjectSchema: z.ZodType<Prisma.ClientProductCreateWithoutClientInput> = makeSchema() as unknown as z.ZodType<Prisma.ClientProductCreateWithoutClientInput>;
export const ClientProductCreateWithoutClientInputObjectZodSchema = makeSchema();

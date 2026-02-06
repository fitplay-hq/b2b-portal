import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ClientCreateNestedOneWithoutProductsInputObjectSchema as ClientCreateNestedOneWithoutProductsInputObjectSchema } from './ClientCreateNestedOneWithoutProductsInput.schema';
import { ProductCreateNestedOneWithoutClientsInputObjectSchema as ProductCreateNestedOneWithoutClientsInputObjectSchema } from './ProductCreateNestedOneWithoutClientsInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  client: z.lazy(() => ClientCreateNestedOneWithoutProductsInputObjectSchema),
  product: z.lazy(() => ProductCreateNestedOneWithoutClientsInputObjectSchema)
}).strict();
export const ClientProductCreateInputObjectSchema: z.ZodType<Prisma.ClientProductCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.ClientProductCreateInput>;
export const ClientProductCreateInputObjectZodSchema = makeSchema();

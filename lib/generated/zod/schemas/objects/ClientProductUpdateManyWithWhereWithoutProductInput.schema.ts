import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ClientProductScalarWhereInputObjectSchema as ClientProductScalarWhereInputObjectSchema } from './ClientProductScalarWhereInput.schema';
import { ClientProductUpdateManyMutationInputObjectSchema as ClientProductUpdateManyMutationInputObjectSchema } from './ClientProductUpdateManyMutationInput.schema';
import { ClientProductUncheckedUpdateManyWithoutProductInputObjectSchema as ClientProductUncheckedUpdateManyWithoutProductInputObjectSchema } from './ClientProductUncheckedUpdateManyWithoutProductInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ClientProductScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => ClientProductUpdateManyMutationInputObjectSchema), z.lazy(() => ClientProductUncheckedUpdateManyWithoutProductInputObjectSchema)])
}).strict();
export const ClientProductUpdateManyWithWhereWithoutProductInputObjectSchema: z.ZodType<Prisma.ClientProductUpdateManyWithWhereWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.ClientProductUpdateManyWithWhereWithoutProductInput>;
export const ClientProductUpdateManyWithWhereWithoutProductInputObjectZodSchema = makeSchema();

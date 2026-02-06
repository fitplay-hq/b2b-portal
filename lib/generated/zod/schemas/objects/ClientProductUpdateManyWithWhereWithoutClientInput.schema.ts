import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ClientProductScalarWhereInputObjectSchema as ClientProductScalarWhereInputObjectSchema } from './ClientProductScalarWhereInput.schema';
import { ClientProductUpdateManyMutationInputObjectSchema as ClientProductUpdateManyMutationInputObjectSchema } from './ClientProductUpdateManyMutationInput.schema';
import { ClientProductUncheckedUpdateManyWithoutClientInputObjectSchema as ClientProductUncheckedUpdateManyWithoutClientInputObjectSchema } from './ClientProductUncheckedUpdateManyWithoutClientInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ClientProductScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => ClientProductUpdateManyMutationInputObjectSchema), z.lazy(() => ClientProductUncheckedUpdateManyWithoutClientInputObjectSchema)])
}).strict();
export const ClientProductUpdateManyWithWhereWithoutClientInputObjectSchema: z.ZodType<Prisma.ClientProductUpdateManyWithWhereWithoutClientInput> = makeSchema() as unknown as z.ZodType<Prisma.ClientProductUpdateManyWithWhereWithoutClientInput>;
export const ClientProductUpdateManyWithWhereWithoutClientInputObjectZodSchema = makeSchema();

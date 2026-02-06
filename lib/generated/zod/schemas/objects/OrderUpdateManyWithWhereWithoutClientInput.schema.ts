import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { OrderScalarWhereInputObjectSchema as OrderScalarWhereInputObjectSchema } from './OrderScalarWhereInput.schema';
import { OrderUpdateManyMutationInputObjectSchema as OrderUpdateManyMutationInputObjectSchema } from './OrderUpdateManyMutationInput.schema';
import { OrderUncheckedUpdateManyWithoutClientInputObjectSchema as OrderUncheckedUpdateManyWithoutClientInputObjectSchema } from './OrderUncheckedUpdateManyWithoutClientInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => OrderScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => OrderUpdateManyMutationInputObjectSchema), z.lazy(() => OrderUncheckedUpdateManyWithoutClientInputObjectSchema)])
}).strict();
export const OrderUpdateManyWithWhereWithoutClientInputObjectSchema: z.ZodType<Prisma.OrderUpdateManyWithWhereWithoutClientInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderUpdateManyWithWhereWithoutClientInput>;
export const OrderUpdateManyWithWhereWithoutClientInputObjectZodSchema = makeSchema();

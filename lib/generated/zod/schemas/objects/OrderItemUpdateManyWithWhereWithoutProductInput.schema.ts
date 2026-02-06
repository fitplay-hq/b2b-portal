import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { OrderItemScalarWhereInputObjectSchema as OrderItemScalarWhereInputObjectSchema } from './OrderItemScalarWhereInput.schema';
import { OrderItemUpdateManyMutationInputObjectSchema as OrderItemUpdateManyMutationInputObjectSchema } from './OrderItemUpdateManyMutationInput.schema';
import { OrderItemUncheckedUpdateManyWithoutProductInputObjectSchema as OrderItemUncheckedUpdateManyWithoutProductInputObjectSchema } from './OrderItemUncheckedUpdateManyWithoutProductInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => OrderItemScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => OrderItemUpdateManyMutationInputObjectSchema), z.lazy(() => OrderItemUncheckedUpdateManyWithoutProductInputObjectSchema)])
}).strict();
export const OrderItemUpdateManyWithWhereWithoutProductInputObjectSchema: z.ZodType<Prisma.OrderItemUpdateManyWithWhereWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderItemUpdateManyWithWhereWithoutProductInput>;
export const OrderItemUpdateManyWithWhereWithoutProductInputObjectZodSchema = makeSchema();

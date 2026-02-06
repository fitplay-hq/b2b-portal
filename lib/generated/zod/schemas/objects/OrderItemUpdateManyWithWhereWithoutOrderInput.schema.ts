import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { OrderItemScalarWhereInputObjectSchema as OrderItemScalarWhereInputObjectSchema } from './OrderItemScalarWhereInput.schema';
import { OrderItemUpdateManyMutationInputObjectSchema as OrderItemUpdateManyMutationInputObjectSchema } from './OrderItemUpdateManyMutationInput.schema';
import { OrderItemUncheckedUpdateManyWithoutOrderInputObjectSchema as OrderItemUncheckedUpdateManyWithoutOrderInputObjectSchema } from './OrderItemUncheckedUpdateManyWithoutOrderInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => OrderItemScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => OrderItemUpdateManyMutationInputObjectSchema), z.lazy(() => OrderItemUncheckedUpdateManyWithoutOrderInputObjectSchema)])
}).strict();
export const OrderItemUpdateManyWithWhereWithoutOrderInputObjectSchema: z.ZodType<Prisma.OrderItemUpdateManyWithWhereWithoutOrderInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderItemUpdateManyWithWhereWithoutOrderInput>;
export const OrderItemUpdateManyWithWhereWithoutOrderInputObjectZodSchema = makeSchema();

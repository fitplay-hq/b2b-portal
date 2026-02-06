import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { OrderEmailScalarWhereInputObjectSchema as OrderEmailScalarWhereInputObjectSchema } from './OrderEmailScalarWhereInput.schema';
import { OrderEmailUpdateManyMutationInputObjectSchema as OrderEmailUpdateManyMutationInputObjectSchema } from './OrderEmailUpdateManyMutationInput.schema';
import { OrderEmailUncheckedUpdateManyWithoutOrderInputObjectSchema as OrderEmailUncheckedUpdateManyWithoutOrderInputObjectSchema } from './OrderEmailUncheckedUpdateManyWithoutOrderInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => OrderEmailScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => OrderEmailUpdateManyMutationInputObjectSchema), z.lazy(() => OrderEmailUncheckedUpdateManyWithoutOrderInputObjectSchema)])
}).strict();
export const OrderEmailUpdateManyWithWhereWithoutOrderInputObjectSchema: z.ZodType<Prisma.OrderEmailUpdateManyWithWhereWithoutOrderInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderEmailUpdateManyWithWhereWithoutOrderInput>;
export const OrderEmailUpdateManyWithWhereWithoutOrderInputObjectZodSchema = makeSchema();

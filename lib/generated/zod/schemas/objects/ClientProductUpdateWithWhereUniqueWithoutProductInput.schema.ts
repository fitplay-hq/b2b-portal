import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ClientProductWhereUniqueInputObjectSchema as ClientProductWhereUniqueInputObjectSchema } from './ClientProductWhereUniqueInput.schema';
import { ClientProductUpdateWithoutProductInputObjectSchema as ClientProductUpdateWithoutProductInputObjectSchema } from './ClientProductUpdateWithoutProductInput.schema';
import { ClientProductUncheckedUpdateWithoutProductInputObjectSchema as ClientProductUncheckedUpdateWithoutProductInputObjectSchema } from './ClientProductUncheckedUpdateWithoutProductInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ClientProductWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => ClientProductUpdateWithoutProductInputObjectSchema), z.lazy(() => ClientProductUncheckedUpdateWithoutProductInputObjectSchema)])
}).strict();
export const ClientProductUpdateWithWhereUniqueWithoutProductInputObjectSchema: z.ZodType<Prisma.ClientProductUpdateWithWhereUniqueWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.ClientProductUpdateWithWhereUniqueWithoutProductInput>;
export const ClientProductUpdateWithWhereUniqueWithoutProductInputObjectZodSchema = makeSchema();

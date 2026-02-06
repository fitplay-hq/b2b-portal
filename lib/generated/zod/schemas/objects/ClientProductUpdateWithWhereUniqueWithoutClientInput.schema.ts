import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ClientProductWhereUniqueInputObjectSchema as ClientProductWhereUniqueInputObjectSchema } from './ClientProductWhereUniqueInput.schema';
import { ClientProductUpdateWithoutClientInputObjectSchema as ClientProductUpdateWithoutClientInputObjectSchema } from './ClientProductUpdateWithoutClientInput.schema';
import { ClientProductUncheckedUpdateWithoutClientInputObjectSchema as ClientProductUncheckedUpdateWithoutClientInputObjectSchema } from './ClientProductUncheckedUpdateWithoutClientInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ClientProductWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => ClientProductUpdateWithoutClientInputObjectSchema), z.lazy(() => ClientProductUncheckedUpdateWithoutClientInputObjectSchema)])
}).strict();
export const ClientProductUpdateWithWhereUniqueWithoutClientInputObjectSchema: z.ZodType<Prisma.ClientProductUpdateWithWhereUniqueWithoutClientInput> = makeSchema() as unknown as z.ZodType<Prisma.ClientProductUpdateWithWhereUniqueWithoutClientInput>;
export const ClientProductUpdateWithWhereUniqueWithoutClientInputObjectZodSchema = makeSchema();

import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ClientProductWhereUniqueInputObjectSchema as ClientProductWhereUniqueInputObjectSchema } from './ClientProductWhereUniqueInput.schema';
import { ClientProductUpdateWithoutClientInputObjectSchema as ClientProductUpdateWithoutClientInputObjectSchema } from './ClientProductUpdateWithoutClientInput.schema';
import { ClientProductUncheckedUpdateWithoutClientInputObjectSchema as ClientProductUncheckedUpdateWithoutClientInputObjectSchema } from './ClientProductUncheckedUpdateWithoutClientInput.schema';
import { ClientProductCreateWithoutClientInputObjectSchema as ClientProductCreateWithoutClientInputObjectSchema } from './ClientProductCreateWithoutClientInput.schema';
import { ClientProductUncheckedCreateWithoutClientInputObjectSchema as ClientProductUncheckedCreateWithoutClientInputObjectSchema } from './ClientProductUncheckedCreateWithoutClientInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ClientProductWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => ClientProductUpdateWithoutClientInputObjectSchema), z.lazy(() => ClientProductUncheckedUpdateWithoutClientInputObjectSchema)]),
  create: z.union([z.lazy(() => ClientProductCreateWithoutClientInputObjectSchema), z.lazy(() => ClientProductUncheckedCreateWithoutClientInputObjectSchema)])
}).strict();
export const ClientProductUpsertWithWhereUniqueWithoutClientInputObjectSchema: z.ZodType<Prisma.ClientProductUpsertWithWhereUniqueWithoutClientInput> = makeSchema() as unknown as z.ZodType<Prisma.ClientProductUpsertWithWhereUniqueWithoutClientInput>;
export const ClientProductUpsertWithWhereUniqueWithoutClientInputObjectZodSchema = makeSchema();

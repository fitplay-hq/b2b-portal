import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ClientProductWhereUniqueInputObjectSchema as ClientProductWhereUniqueInputObjectSchema } from './ClientProductWhereUniqueInput.schema';
import { ClientProductUpdateWithoutProductInputObjectSchema as ClientProductUpdateWithoutProductInputObjectSchema } from './ClientProductUpdateWithoutProductInput.schema';
import { ClientProductUncheckedUpdateWithoutProductInputObjectSchema as ClientProductUncheckedUpdateWithoutProductInputObjectSchema } from './ClientProductUncheckedUpdateWithoutProductInput.schema';
import { ClientProductCreateWithoutProductInputObjectSchema as ClientProductCreateWithoutProductInputObjectSchema } from './ClientProductCreateWithoutProductInput.schema';
import { ClientProductUncheckedCreateWithoutProductInputObjectSchema as ClientProductUncheckedCreateWithoutProductInputObjectSchema } from './ClientProductUncheckedCreateWithoutProductInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ClientProductWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => ClientProductUpdateWithoutProductInputObjectSchema), z.lazy(() => ClientProductUncheckedUpdateWithoutProductInputObjectSchema)]),
  create: z.union([z.lazy(() => ClientProductCreateWithoutProductInputObjectSchema), z.lazy(() => ClientProductUncheckedCreateWithoutProductInputObjectSchema)])
}).strict();
export const ClientProductUpsertWithWhereUniqueWithoutProductInputObjectSchema: z.ZodType<Prisma.ClientProductUpsertWithWhereUniqueWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.ClientProductUpsertWithWhereUniqueWithoutProductInput>;
export const ClientProductUpsertWithWhereUniqueWithoutProductInputObjectZodSchema = makeSchema();

import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SystemUserWhereUniqueInputObjectSchema as SystemUserWhereUniqueInputObjectSchema } from './SystemUserWhereUniqueInput.schema';
import { SystemUserUpdateWithoutRoleInputObjectSchema as SystemUserUpdateWithoutRoleInputObjectSchema } from './SystemUserUpdateWithoutRoleInput.schema';
import { SystemUserUncheckedUpdateWithoutRoleInputObjectSchema as SystemUserUncheckedUpdateWithoutRoleInputObjectSchema } from './SystemUserUncheckedUpdateWithoutRoleInput.schema';
import { SystemUserCreateWithoutRoleInputObjectSchema as SystemUserCreateWithoutRoleInputObjectSchema } from './SystemUserCreateWithoutRoleInput.schema';
import { SystemUserUncheckedCreateWithoutRoleInputObjectSchema as SystemUserUncheckedCreateWithoutRoleInputObjectSchema } from './SystemUserUncheckedCreateWithoutRoleInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => SystemUserWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => SystemUserUpdateWithoutRoleInputObjectSchema), z.lazy(() => SystemUserUncheckedUpdateWithoutRoleInputObjectSchema)]),
  create: z.union([z.lazy(() => SystemUserCreateWithoutRoleInputObjectSchema), z.lazy(() => SystemUserUncheckedCreateWithoutRoleInputObjectSchema)])
}).strict();
export const SystemUserUpsertWithWhereUniqueWithoutRoleInputObjectSchema: z.ZodType<Prisma.SystemUserUpsertWithWhereUniqueWithoutRoleInput> = makeSchema() as unknown as z.ZodType<Prisma.SystemUserUpsertWithWhereUniqueWithoutRoleInput>;
export const SystemUserUpsertWithWhereUniqueWithoutRoleInputObjectZodSchema = makeSchema();

import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SystemUserWhereUniqueInputObjectSchema as SystemUserWhereUniqueInputObjectSchema } from './SystemUserWhereUniqueInput.schema';
import { SystemUserUpdateWithoutRoleInputObjectSchema as SystemUserUpdateWithoutRoleInputObjectSchema } from './SystemUserUpdateWithoutRoleInput.schema';
import { SystemUserUncheckedUpdateWithoutRoleInputObjectSchema as SystemUserUncheckedUpdateWithoutRoleInputObjectSchema } from './SystemUserUncheckedUpdateWithoutRoleInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => SystemUserWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => SystemUserUpdateWithoutRoleInputObjectSchema), z.lazy(() => SystemUserUncheckedUpdateWithoutRoleInputObjectSchema)])
}).strict();
export const SystemUserUpdateWithWhereUniqueWithoutRoleInputObjectSchema: z.ZodType<Prisma.SystemUserUpdateWithWhereUniqueWithoutRoleInput> = makeSchema() as unknown as z.ZodType<Prisma.SystemUserUpdateWithWhereUniqueWithoutRoleInput>;
export const SystemUserUpdateWithWhereUniqueWithoutRoleInputObjectZodSchema = makeSchema();

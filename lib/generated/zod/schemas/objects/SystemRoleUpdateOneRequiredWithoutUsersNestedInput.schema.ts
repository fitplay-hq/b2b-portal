import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SystemRoleCreateWithoutUsersInputObjectSchema as SystemRoleCreateWithoutUsersInputObjectSchema } from './SystemRoleCreateWithoutUsersInput.schema';
import { SystemRoleUncheckedCreateWithoutUsersInputObjectSchema as SystemRoleUncheckedCreateWithoutUsersInputObjectSchema } from './SystemRoleUncheckedCreateWithoutUsersInput.schema';
import { SystemRoleCreateOrConnectWithoutUsersInputObjectSchema as SystemRoleCreateOrConnectWithoutUsersInputObjectSchema } from './SystemRoleCreateOrConnectWithoutUsersInput.schema';
import { SystemRoleUpsertWithoutUsersInputObjectSchema as SystemRoleUpsertWithoutUsersInputObjectSchema } from './SystemRoleUpsertWithoutUsersInput.schema';
import { SystemRoleWhereUniqueInputObjectSchema as SystemRoleWhereUniqueInputObjectSchema } from './SystemRoleWhereUniqueInput.schema';
import { SystemRoleUpdateToOneWithWhereWithoutUsersInputObjectSchema as SystemRoleUpdateToOneWithWhereWithoutUsersInputObjectSchema } from './SystemRoleUpdateToOneWithWhereWithoutUsersInput.schema';
import { SystemRoleUpdateWithoutUsersInputObjectSchema as SystemRoleUpdateWithoutUsersInputObjectSchema } from './SystemRoleUpdateWithoutUsersInput.schema';
import { SystemRoleUncheckedUpdateWithoutUsersInputObjectSchema as SystemRoleUncheckedUpdateWithoutUsersInputObjectSchema } from './SystemRoleUncheckedUpdateWithoutUsersInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => SystemRoleCreateWithoutUsersInputObjectSchema), z.lazy(() => SystemRoleUncheckedCreateWithoutUsersInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => SystemRoleCreateOrConnectWithoutUsersInputObjectSchema).optional(),
  upsert: z.lazy(() => SystemRoleUpsertWithoutUsersInputObjectSchema).optional(),
  connect: z.lazy(() => SystemRoleWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => SystemRoleUpdateToOneWithWhereWithoutUsersInputObjectSchema), z.lazy(() => SystemRoleUpdateWithoutUsersInputObjectSchema), z.lazy(() => SystemRoleUncheckedUpdateWithoutUsersInputObjectSchema)]).optional()
}).strict();
export const SystemRoleUpdateOneRequiredWithoutUsersNestedInputObjectSchema: z.ZodType<Prisma.SystemRoleUpdateOneRequiredWithoutUsersNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.SystemRoleUpdateOneRequiredWithoutUsersNestedInput>;
export const SystemRoleUpdateOneRequiredWithoutUsersNestedInputObjectZodSchema = makeSchema();

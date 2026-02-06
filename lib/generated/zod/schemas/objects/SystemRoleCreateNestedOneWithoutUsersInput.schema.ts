import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SystemRoleCreateWithoutUsersInputObjectSchema as SystemRoleCreateWithoutUsersInputObjectSchema } from './SystemRoleCreateWithoutUsersInput.schema';
import { SystemRoleUncheckedCreateWithoutUsersInputObjectSchema as SystemRoleUncheckedCreateWithoutUsersInputObjectSchema } from './SystemRoleUncheckedCreateWithoutUsersInput.schema';
import { SystemRoleCreateOrConnectWithoutUsersInputObjectSchema as SystemRoleCreateOrConnectWithoutUsersInputObjectSchema } from './SystemRoleCreateOrConnectWithoutUsersInput.schema';
import { SystemRoleWhereUniqueInputObjectSchema as SystemRoleWhereUniqueInputObjectSchema } from './SystemRoleWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => SystemRoleCreateWithoutUsersInputObjectSchema), z.lazy(() => SystemRoleUncheckedCreateWithoutUsersInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => SystemRoleCreateOrConnectWithoutUsersInputObjectSchema).optional(),
  connect: z.lazy(() => SystemRoleWhereUniqueInputObjectSchema).optional()
}).strict();
export const SystemRoleCreateNestedOneWithoutUsersInputObjectSchema: z.ZodType<Prisma.SystemRoleCreateNestedOneWithoutUsersInput> = makeSchema() as unknown as z.ZodType<Prisma.SystemRoleCreateNestedOneWithoutUsersInput>;
export const SystemRoleCreateNestedOneWithoutUsersInputObjectZodSchema = makeSchema();

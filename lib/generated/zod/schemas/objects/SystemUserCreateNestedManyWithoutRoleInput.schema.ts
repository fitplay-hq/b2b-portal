import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SystemUserCreateWithoutRoleInputObjectSchema as SystemUserCreateWithoutRoleInputObjectSchema } from './SystemUserCreateWithoutRoleInput.schema';
import { SystemUserUncheckedCreateWithoutRoleInputObjectSchema as SystemUserUncheckedCreateWithoutRoleInputObjectSchema } from './SystemUserUncheckedCreateWithoutRoleInput.schema';
import { SystemUserCreateOrConnectWithoutRoleInputObjectSchema as SystemUserCreateOrConnectWithoutRoleInputObjectSchema } from './SystemUserCreateOrConnectWithoutRoleInput.schema';
import { SystemUserCreateManyRoleInputEnvelopeObjectSchema as SystemUserCreateManyRoleInputEnvelopeObjectSchema } from './SystemUserCreateManyRoleInputEnvelope.schema';
import { SystemUserWhereUniqueInputObjectSchema as SystemUserWhereUniqueInputObjectSchema } from './SystemUserWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => SystemUserCreateWithoutRoleInputObjectSchema), z.lazy(() => SystemUserCreateWithoutRoleInputObjectSchema).array(), z.lazy(() => SystemUserUncheckedCreateWithoutRoleInputObjectSchema), z.lazy(() => SystemUserUncheckedCreateWithoutRoleInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => SystemUserCreateOrConnectWithoutRoleInputObjectSchema), z.lazy(() => SystemUserCreateOrConnectWithoutRoleInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => SystemUserCreateManyRoleInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => SystemUserWhereUniqueInputObjectSchema), z.lazy(() => SystemUserWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const SystemUserCreateNestedManyWithoutRoleInputObjectSchema: z.ZodType<Prisma.SystemUserCreateNestedManyWithoutRoleInput> = makeSchema() as unknown as z.ZodType<Prisma.SystemUserCreateNestedManyWithoutRoleInput>;
export const SystemUserCreateNestedManyWithoutRoleInputObjectZodSchema = makeSchema();

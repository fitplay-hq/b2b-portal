import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SystemUserCreateWithoutRoleInputObjectSchema as SystemUserCreateWithoutRoleInputObjectSchema } from './SystemUserCreateWithoutRoleInput.schema';
import { SystemUserUncheckedCreateWithoutRoleInputObjectSchema as SystemUserUncheckedCreateWithoutRoleInputObjectSchema } from './SystemUserUncheckedCreateWithoutRoleInput.schema';
import { SystemUserCreateOrConnectWithoutRoleInputObjectSchema as SystemUserCreateOrConnectWithoutRoleInputObjectSchema } from './SystemUserCreateOrConnectWithoutRoleInput.schema';
import { SystemUserUpsertWithWhereUniqueWithoutRoleInputObjectSchema as SystemUserUpsertWithWhereUniqueWithoutRoleInputObjectSchema } from './SystemUserUpsertWithWhereUniqueWithoutRoleInput.schema';
import { SystemUserCreateManyRoleInputEnvelopeObjectSchema as SystemUserCreateManyRoleInputEnvelopeObjectSchema } from './SystemUserCreateManyRoleInputEnvelope.schema';
import { SystemUserWhereUniqueInputObjectSchema as SystemUserWhereUniqueInputObjectSchema } from './SystemUserWhereUniqueInput.schema';
import { SystemUserUpdateWithWhereUniqueWithoutRoleInputObjectSchema as SystemUserUpdateWithWhereUniqueWithoutRoleInputObjectSchema } from './SystemUserUpdateWithWhereUniqueWithoutRoleInput.schema';
import { SystemUserUpdateManyWithWhereWithoutRoleInputObjectSchema as SystemUserUpdateManyWithWhereWithoutRoleInputObjectSchema } from './SystemUserUpdateManyWithWhereWithoutRoleInput.schema';
import { SystemUserScalarWhereInputObjectSchema as SystemUserScalarWhereInputObjectSchema } from './SystemUserScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => SystemUserCreateWithoutRoleInputObjectSchema), z.lazy(() => SystemUserCreateWithoutRoleInputObjectSchema).array(), z.lazy(() => SystemUserUncheckedCreateWithoutRoleInputObjectSchema), z.lazy(() => SystemUserUncheckedCreateWithoutRoleInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => SystemUserCreateOrConnectWithoutRoleInputObjectSchema), z.lazy(() => SystemUserCreateOrConnectWithoutRoleInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => SystemUserUpsertWithWhereUniqueWithoutRoleInputObjectSchema), z.lazy(() => SystemUserUpsertWithWhereUniqueWithoutRoleInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => SystemUserCreateManyRoleInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => SystemUserWhereUniqueInputObjectSchema), z.lazy(() => SystemUserWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => SystemUserWhereUniqueInputObjectSchema), z.lazy(() => SystemUserWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => SystemUserWhereUniqueInputObjectSchema), z.lazy(() => SystemUserWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => SystemUserWhereUniqueInputObjectSchema), z.lazy(() => SystemUserWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => SystemUserUpdateWithWhereUniqueWithoutRoleInputObjectSchema), z.lazy(() => SystemUserUpdateWithWhereUniqueWithoutRoleInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => SystemUserUpdateManyWithWhereWithoutRoleInputObjectSchema), z.lazy(() => SystemUserUpdateManyWithWhereWithoutRoleInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => SystemUserScalarWhereInputObjectSchema), z.lazy(() => SystemUserScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const SystemUserUpdateManyWithoutRoleNestedInputObjectSchema: z.ZodType<Prisma.SystemUserUpdateManyWithoutRoleNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.SystemUserUpdateManyWithoutRoleNestedInput>;
export const SystemUserUpdateManyWithoutRoleNestedInputObjectZodSchema = makeSchema();

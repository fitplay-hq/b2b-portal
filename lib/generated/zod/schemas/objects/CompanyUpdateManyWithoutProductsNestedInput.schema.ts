import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { CompanyCreateWithoutProductsInputObjectSchema as CompanyCreateWithoutProductsInputObjectSchema } from './CompanyCreateWithoutProductsInput.schema';
import { CompanyUncheckedCreateWithoutProductsInputObjectSchema as CompanyUncheckedCreateWithoutProductsInputObjectSchema } from './CompanyUncheckedCreateWithoutProductsInput.schema';
import { CompanyCreateOrConnectWithoutProductsInputObjectSchema as CompanyCreateOrConnectWithoutProductsInputObjectSchema } from './CompanyCreateOrConnectWithoutProductsInput.schema';
import { CompanyUpsertWithWhereUniqueWithoutProductsInputObjectSchema as CompanyUpsertWithWhereUniqueWithoutProductsInputObjectSchema } from './CompanyUpsertWithWhereUniqueWithoutProductsInput.schema';
import { CompanyWhereUniqueInputObjectSchema as CompanyWhereUniqueInputObjectSchema } from './CompanyWhereUniqueInput.schema';
import { CompanyUpdateWithWhereUniqueWithoutProductsInputObjectSchema as CompanyUpdateWithWhereUniqueWithoutProductsInputObjectSchema } from './CompanyUpdateWithWhereUniqueWithoutProductsInput.schema';
import { CompanyUpdateManyWithWhereWithoutProductsInputObjectSchema as CompanyUpdateManyWithWhereWithoutProductsInputObjectSchema } from './CompanyUpdateManyWithWhereWithoutProductsInput.schema';
import { CompanyScalarWhereInputObjectSchema as CompanyScalarWhereInputObjectSchema } from './CompanyScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => CompanyCreateWithoutProductsInputObjectSchema), z.lazy(() => CompanyCreateWithoutProductsInputObjectSchema).array(), z.lazy(() => CompanyUncheckedCreateWithoutProductsInputObjectSchema), z.lazy(() => CompanyUncheckedCreateWithoutProductsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => CompanyCreateOrConnectWithoutProductsInputObjectSchema), z.lazy(() => CompanyCreateOrConnectWithoutProductsInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => CompanyUpsertWithWhereUniqueWithoutProductsInputObjectSchema), z.lazy(() => CompanyUpsertWithWhereUniqueWithoutProductsInputObjectSchema).array()]).optional(),
  set: z.union([z.lazy(() => CompanyWhereUniqueInputObjectSchema), z.lazy(() => CompanyWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => CompanyWhereUniqueInputObjectSchema), z.lazy(() => CompanyWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => CompanyWhereUniqueInputObjectSchema), z.lazy(() => CompanyWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => CompanyWhereUniqueInputObjectSchema), z.lazy(() => CompanyWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => CompanyUpdateWithWhereUniqueWithoutProductsInputObjectSchema), z.lazy(() => CompanyUpdateWithWhereUniqueWithoutProductsInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => CompanyUpdateManyWithWhereWithoutProductsInputObjectSchema), z.lazy(() => CompanyUpdateManyWithWhereWithoutProductsInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => CompanyScalarWhereInputObjectSchema), z.lazy(() => CompanyScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const CompanyUpdateManyWithoutProductsNestedInputObjectSchema: z.ZodType<Prisma.CompanyUpdateManyWithoutProductsNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.CompanyUpdateManyWithoutProductsNestedInput>;
export const CompanyUpdateManyWithoutProductsNestedInputObjectZodSchema = makeSchema();

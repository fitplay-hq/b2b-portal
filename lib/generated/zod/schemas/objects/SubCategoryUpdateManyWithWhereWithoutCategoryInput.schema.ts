import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SubCategoryScalarWhereInputObjectSchema as SubCategoryScalarWhereInputObjectSchema } from './SubCategoryScalarWhereInput.schema';
import { SubCategoryUpdateManyMutationInputObjectSchema as SubCategoryUpdateManyMutationInputObjectSchema } from './SubCategoryUpdateManyMutationInput.schema';
import { SubCategoryUncheckedUpdateManyWithoutCategoryInputObjectSchema as SubCategoryUncheckedUpdateManyWithoutCategoryInputObjectSchema } from './SubCategoryUncheckedUpdateManyWithoutCategoryInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => SubCategoryScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => SubCategoryUpdateManyMutationInputObjectSchema), z.lazy(() => SubCategoryUncheckedUpdateManyWithoutCategoryInputObjectSchema)])
}).strict();
export const SubCategoryUpdateManyWithWhereWithoutCategoryInputObjectSchema: z.ZodType<Prisma.SubCategoryUpdateManyWithWhereWithoutCategoryInput> = makeSchema() as unknown as z.ZodType<Prisma.SubCategoryUpdateManyWithWhereWithoutCategoryInput>;
export const SubCategoryUpdateManyWithWhereWithoutCategoryInputObjectZodSchema = makeSchema();

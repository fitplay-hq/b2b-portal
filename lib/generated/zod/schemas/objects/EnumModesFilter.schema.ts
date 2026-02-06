import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ModesSchema } from '../enums/Modes.schema';
import { NestedEnumModesFilterObjectSchema as NestedEnumModesFilterObjectSchema } from './NestedEnumModesFilter.schema'

const makeSchema = () => z.object({
  equals: ModesSchema.optional(),
  in: ModesSchema.array().optional(),
  notIn: ModesSchema.array().optional(),
  not: z.union([ModesSchema, z.lazy(() => NestedEnumModesFilterObjectSchema)]).optional()
}).strict();
export const EnumModesFilterObjectSchema: z.ZodType<Prisma.EnumModesFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumModesFilter>;
export const EnumModesFilterObjectZodSchema = makeSchema();

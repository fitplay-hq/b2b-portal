import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ModesSchema } from '../enums/Modes.schema';
import { NestedEnumModesWithAggregatesFilterObjectSchema as NestedEnumModesWithAggregatesFilterObjectSchema } from './NestedEnumModesWithAggregatesFilter.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumModesFilterObjectSchema as NestedEnumModesFilterObjectSchema } from './NestedEnumModesFilter.schema'

const makeSchema = () => z.object({
  equals: ModesSchema.optional(),
  in: ModesSchema.array().optional(),
  notIn: ModesSchema.array().optional(),
  not: z.union([ModesSchema, z.lazy(() => NestedEnumModesWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumModesFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumModesFilterObjectSchema).optional()
}).strict();
export const EnumModesWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumModesWithAggregatesFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumModesWithAggregatesFilter>;
export const EnumModesWithAggregatesFilterObjectZodSchema = makeSchema();

import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ModesSchema } from '../enums/Modes.schema'

const nestedenummodesfilterSchema = z.object({
  equals: ModesSchema.optional(),
  in: ModesSchema.array().optional(),
  notIn: ModesSchema.array().optional(),
  not: z.union([ModesSchema, z.lazy(() => NestedEnumModesFilterObjectSchema)]).optional()
}).strict();
export const NestedEnumModesFilterObjectSchema: z.ZodType<Prisma.NestedEnumModesFilter> = nestedenummodesfilterSchema as unknown as z.ZodType<Prisma.NestedEnumModesFilter>;
export const NestedEnumModesFilterObjectZodSchema = nestedenummodesfilterSchema;

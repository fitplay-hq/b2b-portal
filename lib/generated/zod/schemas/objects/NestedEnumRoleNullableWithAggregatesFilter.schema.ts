import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { RoleSchema } from '../enums/Role.schema';
import { NestedIntNullableFilterObjectSchema as NestedIntNullableFilterObjectSchema } from './NestedIntNullableFilter.schema';
import { NestedEnumRoleNullableFilterObjectSchema as NestedEnumRoleNullableFilterObjectSchema } from './NestedEnumRoleNullableFilter.schema'

const nestedenumrolenullablewithaggregatesfilterSchema = z.object({
  equals: RoleSchema.optional().nullable(),
  in: RoleSchema.array().optional().nullable(),
  notIn: RoleSchema.array().optional().nullable(),
  not: z.union([RoleSchema, z.lazy(() => NestedEnumRoleNullableWithAggregatesFilterObjectSchema)]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumRoleNullableFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumRoleNullableFilterObjectSchema).optional()
}).strict();
export const NestedEnumRoleNullableWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumRoleNullableWithAggregatesFilter> = nestedenumrolenullablewithaggregatesfilterSchema as unknown as z.ZodType<Prisma.NestedEnumRoleNullableWithAggregatesFilter>;
export const NestedEnumRoleNullableWithAggregatesFilterObjectZodSchema = nestedenumrolenullablewithaggregatesfilterSchema;

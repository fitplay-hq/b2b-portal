import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { RoleSchema } from '../enums/Role.schema'

const nestedenumrolenullablefilterSchema = z.object({
  equals: RoleSchema.optional().nullable(),
  in: RoleSchema.array().optional().nullable(),
  notIn: RoleSchema.array().optional().nullable(),
  not: z.union([RoleSchema, z.lazy(() => NestedEnumRoleNullableFilterObjectSchema)]).optional().nullable()
}).strict();
export const NestedEnumRoleNullableFilterObjectSchema: z.ZodType<Prisma.NestedEnumRoleNullableFilter> = nestedenumrolenullablefilterSchema as unknown as z.ZodType<Prisma.NestedEnumRoleNullableFilter>;
export const NestedEnumRoleNullableFilterObjectZodSchema = nestedenumrolenullablefilterSchema;

import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { RoleSchema } from '../enums/Role.schema';
import { NestedEnumRoleNullableFilterObjectSchema as NestedEnumRoleNullableFilterObjectSchema } from './NestedEnumRoleNullableFilter.schema'

const makeSchema = () => z.object({
  equals: RoleSchema.optional().nullable(),
  in: RoleSchema.array().optional().nullable(),
  notIn: RoleSchema.array().optional().nullable(),
  not: z.union([RoleSchema, z.lazy(() => NestedEnumRoleNullableFilterObjectSchema)]).optional().nullable()
}).strict();
export const EnumRoleNullableFilterObjectSchema: z.ZodType<Prisma.EnumRoleNullableFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumRoleNullableFilter>;
export const EnumRoleNullableFilterObjectZodSchema = makeSchema();

import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { SystemPermissionUpdateManyMutationInputObjectSchema as SystemPermissionUpdateManyMutationInputObjectSchema } from './objects/SystemPermissionUpdateManyMutationInput.schema';
import { SystemPermissionWhereInputObjectSchema as SystemPermissionWhereInputObjectSchema } from './objects/SystemPermissionWhereInput.schema';

export const SystemPermissionUpdateManySchema: z.ZodType<Prisma.SystemPermissionUpdateManyArgs> = z.object({ data: SystemPermissionUpdateManyMutationInputObjectSchema, where: SystemPermissionWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.SystemPermissionUpdateManyArgs>;

export const SystemPermissionUpdateManyZodSchema = z.object({ data: SystemPermissionUpdateManyMutationInputObjectSchema, where: SystemPermissionWhereInputObjectSchema.optional() }).strict();
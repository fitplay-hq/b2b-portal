import type { Prisma } from '../../prisma';
import * as z from 'zod';
import { SystemPermissionSelectObjectSchema as SystemPermissionSelectObjectSchema } from './objects/SystemPermissionSelect.schema';
import { SystemPermissionUpdateManyMutationInputObjectSchema as SystemPermissionUpdateManyMutationInputObjectSchema } from './objects/SystemPermissionUpdateManyMutationInput.schema';
import { SystemPermissionWhereInputObjectSchema as SystemPermissionWhereInputObjectSchema } from './objects/SystemPermissionWhereInput.schema';

export const SystemPermissionUpdateManyAndReturnSchema: z.ZodType<Prisma.SystemPermissionUpdateManyAndReturnArgs> = z.object({ select: SystemPermissionSelectObjectSchema.optional(), data: SystemPermissionUpdateManyMutationInputObjectSchema, where: SystemPermissionWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.SystemPermissionUpdateManyAndReturnArgs>;

export const SystemPermissionUpdateManyAndReturnZodSchema = z.object({ select: SystemPermissionSelectObjectSchema.optional(), data: SystemPermissionUpdateManyMutationInputObjectSchema, where: SystemPermissionWhereInputObjectSchema.optional() }).strict();
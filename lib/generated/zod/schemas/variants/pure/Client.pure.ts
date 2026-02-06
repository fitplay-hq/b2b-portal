import * as z from 'zod';
import { RoleSchema } from '../../enums/Role.schema';
// prettier-ignore
export const ClientModelSchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    password: z.string(),
    phone: z.string(),
    company: z.unknown().nullable(),
    companyID: z.string().nullable(),
    companyName: z.string().nullable(),
    isShowPrice: z.boolean(),
    address: z.string(),
    role: RoleSchema,
    createdAt: z.date(),
    updatedAt: z.date(),
    orders: z.array(z.unknown()),
    products: z.array(z.unknown())
}).strict();

export type ClientPureType = z.infer<typeof ClientModelSchema>;

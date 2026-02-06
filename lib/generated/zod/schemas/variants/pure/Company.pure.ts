import * as z from 'zod';
// prettier-ignore
export const CompanyModelSchema = z.object({
    id: z.string(),
    name: z.string(),
    address: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
    products: z.array(z.unknown()),
    clients: z.array(z.unknown())
}).strict();

export type CompanyPureType = z.infer<typeof CompanyModelSchema>;

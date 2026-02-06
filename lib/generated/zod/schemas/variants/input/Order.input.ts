import * as z from 'zod';
import { ModesSchema } from '../../enums/Modes.schema';
import { StatusSchema } from '../../enums/Status.schema';
// prettier-ignore
export const OrderInputSchema = z.object({
    id: z.string(),
    totalAmount: z.number(),
    consigneeName: z.string(),
    consigneePhone: z.string(),
    consigneeEmail: z.string(),
    consignmentNumber: z.string().optional().nullable(),
    deliveryService: z.string().optional().nullable(),
    deliveryAddress: z.string(),
    city: z.string(),
    state: z.string(),
    pincode: z.string(),
    modeOfDelivery: ModesSchema,
    requiredByDate: z.date(),
    deliveryReference: z.string().optional().nullable(),
    packagingInstructions: z.string().optional().nullable(),
    note: z.string().optional().nullable(),
    shippingLabelUrl: z.string().optional().nullable(),
    isMailSent: z.boolean(),
    status: StatusSchema,
    client: z.unknown().optional().nullable(),
    clientId: z.string().optional().nullable(),
    orderItems: z.array(z.unknown()),
    createdAt: z.date(),
    updatedAt: z.date(),
    emails: z.array(z.unknown()),
    bundleOrderItems: z.array(z.unknown()),
    bundles: z.array(z.unknown()),
    numberOfBundles: z.number().int().optional().nullable()
}).strict();

export type OrderInputType = z.infer<typeof OrderInputSchema>;

import * as z from 'zod';
import { ModesSchema } from '../../enums/Modes.schema';
import { StatusSchema } from '../../enums/Status.schema';
// prettier-ignore
export const OrderModelSchema = z.object({
    id: z.string(),
    totalAmount: z.number(),
    consigneeName: z.string(),
    consigneePhone: z.string(),
    consigneeEmail: z.string(),
    consignmentNumber: z.string().nullable(),
    deliveryService: z.string().nullable(),
    deliveryAddress: z.string(),
    city: z.string(),
    state: z.string(),
    pincode: z.string(),
    modeOfDelivery: ModesSchema,
    requiredByDate: z.date(),
    deliveryReference: z.string().nullable(),
    packagingInstructions: z.string().nullable(),
    note: z.string().nullable(),
    shippingLabelUrl: z.string().nullable(),
    isMailSent: z.boolean(),
    status: StatusSchema,
    client: z.unknown().nullable(),
    clientId: z.string().nullable(),
    orderItems: z.array(z.unknown()),
    createdAt: z.date(),
    updatedAt: z.date(),
    emails: z.array(z.unknown()),
    bundleOrderItems: z.array(z.unknown()),
    bundles: z.array(z.unknown()),
    numberOfBundles: z.number().int().nullable()
}).strict();

export type OrderPureType = z.infer<typeof OrderModelSchema>;

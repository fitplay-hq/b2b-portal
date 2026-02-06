import * as z from 'zod';

export const OrderScalarFieldEnumSchema = z.enum(['id', 'totalAmount', 'consigneeName', 'consigneePhone', 'consigneeEmail', 'consignmentNumber', 'deliveryService', 'deliveryAddress', 'city', 'state', 'pincode', 'modeOfDelivery', 'requiredByDate', 'deliveryReference', 'packagingInstructions', 'note', 'shippingLabelUrl', 'isMailSent', 'status', 'clientId', 'createdAt', 'updatedAt', 'numberOfBundles'])

export type OrderScalarFieldEnum = z.infer<typeof OrderScalarFieldEnumSchema>;
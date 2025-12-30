import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { withPermissions } from "@/lib/auth-middleware";

export async function GET(req: NextRequest) {
    return withPermissions(req, async () => {
        try {

            const orders = await prisma.order.findMany({
                select: {
                    id: true,
                    totalAmount: true,
                    numberOfBundles: true,
                    consigneeName: true,
                    consigneePhone: true,
                    consigneeEmail: true,
                    deliveryAddress: true,
                    city: true,
                    state: true,
                    pincode: true,
                    modeOfDelivery: true,
                    deliveryReference: true,
                    packagingInstructions: true,
                    note: true,
                    shippingLabelUrl: true,
                    status: true,
                    consignmentNumber: true,
                    deliveryService: true,
                    isMailSent: true,
                    clientId: true,
                    createdAt: true,
                    updatedAt: true,
                    emails: {
                        select: {
                            id: true,
                            purpose: true,
                            isSent: true,
                            sentAt: true,
                            createdAt: true,
                        },
                        orderBy: {
                            createdAt: 'desc',
                        },
                    },
                    orderItems: {
                        select: {
                            id: true,
                            quantity: true,
                            price: true,
                            productId: true,
                            orderId: true,
                            product: {
                                select: {
                                    id: true,
                                    name: true,
                                    images: true,
                                    sku: true,
                                    price: true
                                },
                            },
                        },
                    },
                    bundleOrderItems: {
                        select: {
                            id: true,
                            quantity: true,
                            price: true,
                            productId: true,
                            bundleId: true,
                            orderId: true,
                            product: {
                                select: {
                                    id: true,
                                    name: true,
                                    images: true,
                                    sku: true,
                                    price: true
                                },
                            },
                            bundle: {
                                select: {
                                    id: true,
                                    price: true
                                }
                            }
                        }
                    },
                    client: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            companyName: true,
                            company: {
                                select: {
                                    id: true,
                                    name: true,
                                    address: true
                                }
                            }
                        },
                    },
                },
                orderBy: {
                    createdAt: "desc",
                },
            });

            return NextResponse.json(orders);
        } catch (error) {
            console.error("Error fetching admin orders:", error);
            return NextResponse.json(
                { error: "Failed to fetch orders" },
                { status: 500 }
            );
        }
    }, "orders", "view");
}

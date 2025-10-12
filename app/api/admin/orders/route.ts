import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { checkPermission } from "@/lib/auth-middleware";
import { RESOURCES } from "@/lib/utils";

export async function GET() {
    try {
        // Check permissions
        const permissionCheck = await checkPermission(RESOURCES.ORDERS, 'view');
        if (!permissionCheck.success) {
            return NextResponse.json(
                { error: permissionCheck.error },
                { status: permissionCheck.error === 'Authentication required' ? 401 : 403 }
            );
        }

        const orders = await prisma.order.findMany({
            select: {
                id: true,
                totalAmount: true,
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
                status: true,
                consignmentNumber: true,
                deliveryService: true,
                isMailSent: true,
                clientId: true,
                createdAt: true,
                updatedAt: true,
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
}

import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(auth);

        if (!session || !session?.user?.email) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const orders = await prisma.order.findMany({
            where: {
                clientId: session.user.id
            },
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
                status: true,
                createdAt: true,
                updatedAt: true,
                orderItems: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                images: true,
                                price: true
                            }
                        }
                    }
                },
                bundleOrderItems: {
                    include: {
                        bundle: {
                            include: {
                                items: {
                                    include: {
                                        product: {
                                            select: {
                                                id: true,
                                                name: true,
                                                images: true,
                                                sku: true,
                                                price: true
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        return NextResponse.json(orders);
    } catch (error) {
        console.error("Error fetching orders:", error);
        return NextResponse.json(
            { error: "Failed to fetch orders" },
            { status: 500 }
        );
    }
}
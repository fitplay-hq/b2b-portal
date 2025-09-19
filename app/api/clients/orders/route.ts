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

        // Get client with isShowPrice
        const client = await prisma.client.findUnique({
            where: { email: session.user.email },
            select: { isShowPrice: true },
        });

        const orders = await prisma.order.findMany({
            where: {
                clientId: session.user.id
            },
            include: {
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
                }
            }
        });

        // Conditionally include prices based on client's isShowPrice setting
        const ordersWithConditionalPrices = orders.map(order => {
            if (client?.isShowPrice) {
                return order;
            } else {
                // Remove prices from response
                const orderWithoutPrices = {
                    ...order,
                    totalAmount: 0, // Hide total amount
                    orderItems: order.orderItems.map(item => ({
                        ...item,
                        price: 0, // Hide item price
                        product: {
                            ...item.product,
                            price: undefined // Remove product price
                        }
                    }))
                };
                return orderWithoutPrices;
            }
        });

        return NextResponse.json(ordersWithConditionalPrices);
    } catch (error) {
        console.error("Error fetching orders:", error);
        return NextResponse.json(
            { error: "Failed to fetch orders" },
            { status: 500 }
        );
    }
}
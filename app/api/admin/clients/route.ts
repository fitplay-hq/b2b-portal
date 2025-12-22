import { NextRequest, NextResponse } from "next/server";
import { withPermissions } from "@/lib/auth-middleware";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
   return withPermissions(req, async () => {
       try {
           const clients = await prisma.client.findMany({
               include: {
                   company: true,
                   products: {
                       select: {
                           product: {
                               select: {
                                   id: true,
                                   name: true,
                                   sku: true,
                               }
                           }
                       }
                   },
                   _count: {
                       select: {
                           products: true
                       }
                   }
               },
           });
           return NextResponse.json({ data: clients }, { status: 200 });
       } catch (error: any) {
           return NextResponse.json(
               { error: error.message || "Something went wrong couldn't fetch clients" },
               { status: 500 },
           );
       }
   }, "clients", "view");
}
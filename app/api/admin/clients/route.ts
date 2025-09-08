import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
   try {
       const session = await getServerSession(auth);

       if (!session || !session?.user || session?.user?.role !== "ADMIN") {
           return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
       }

       const clients = await prisma.client.findMany();
       return NextResponse.json({ data: clients }, { status: 200 });

   } catch (error: any) {
       return NextResponse.json(
           { error: error.message || "Something went wrong couldn't fetch clients" },
           { status: 500 },
       );
   }
}
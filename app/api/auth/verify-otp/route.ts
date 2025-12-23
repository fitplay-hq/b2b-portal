import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { email, otp } = body;

        if (!email || !otp) {
            return NextResponse.json(
                { error: "Email and OTP are required" },
                { status: 400 }
            );
        }

        const loginToken = await prisma.loginToken.findFirst({
            where: {
                identifier: email,
                expires: { gt: new Date() },
            },
            orderBy: { createdAt: "desc" },
        });

        if (!loginToken) {
            return NextResponse.json(
                { error: "OTP expired or invalid" },
                { status: 400 }
            );
        }

        const isOtpValid = await bcrypt.compare(otp, loginToken.token);

        if (!isOtpValid) {
            return NextResponse.json(
                { error: "Invalid OTP" },
                { status: 400 }
            );
        }

        await prisma.loginToken.delete({
            where: { id: loginToken.id },
        });

        return NextResponse.json({
            message: "OTP verified successfully",
            userId: loginToken.userId,
            userType: loginToken.userType,
        });
    } catch (err) {
        console.error("Verify OTP error:", err);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

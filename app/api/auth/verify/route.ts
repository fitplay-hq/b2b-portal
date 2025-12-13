import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

function looksLikeEmail(value: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const token = searchParams.get("token");

        console.log(`🔍 Verification attempt for token: ${token?.slice(0, 8)}...`);

        if (!token) {
            console.log("❌ No token provided");
            return NextResponse.json({ error: "Invalid token" }, { status: 400 });
        }

        const record = await prisma.resetToken.findUnique({
            where: { token: String(token) },
        });

        console.log(`📋 Token record found:`, {
            exists: !!record,
            identifier: record?.identifier,
            expires: record?.expires,
            isExpired: record ? record.expires < new Date() : null,
        });

        if (!record) {
            console.log("❌ Token not found in database");
            return NextResponse.json({ error: "Invalid token" }, { status: 400 });
        }

        if (record.expires < new Date()) {
            console.log(`❌ Token expired: ${record.expires} < ${new Date()}`);
            await prisma.resetToken.delete({
                where: { token: String(token) },
            });
            return NextResponse.json({ error: "Token has expired" }, { status: 400 });
        }

        if (!looksLikeEmail(record.identifier)) {
            console.log(`❌ Not an email verification token: ${record.identifier}`);
            return NextResponse.json(
                { error: "This is not an email verification token" },
                { status: 400 }
            );
        }

        // Since the backend developer stored userId and userType in the token,
        // we can use that to directly authenticate the user
        console.log(`🔑 Token contains userId: ${record.userId}, userType: ${record.userType}`);

        // Verify the stored user still exists based on userType
        let user;
        let userRole;
        
        if (record.userType === "CLIENT") {
            user = await prisma.client.findUnique({
                where: { id: record.userId },
            });
            userRole = "CLIENT";
        } else if (record.userType === "ADMIN") {
            user = await prisma.admin.findUnique({
                where: { id: record.userId },
            });
            userRole = "ADMIN";
        } else if (record.userType === "SYSTEM_USER") {
            user = await prisma.systemUser.findUnique({
                where: { id: record.userId },
                include: { role: true },
            });
            userRole = user?.role?.name || "SYSTEM_USER";
        }

        if (!user) {
            console.log(`❌ User not found for userId: ${record.userId}, userType: ${record.userType}`);
            return NextResponse.json({ error: "User not found" }, { status: 400 });
        }

        // Delete the used token
        await prisma.resetToken.delete({ where: { token: String(token) } });

        console.log(`✅ Email verified successfully for: ${record.identifier}`);
        
        // Return user data for the frontend to handle NextAuth session creation
        return NextResponse.json({
            message: "Email verified successfully",
            verified: true,
            email: record.identifier,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: userRole,
            }
        });
    } catch (err) {
        console.error("🔥 Verification error:", err);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

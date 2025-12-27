import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { Resend } from "resend";
import { Role } from "@/lib/generated/prisma";

const resendApiKey = process.env.RESEND_API_KEY;
if (!resendApiKey) throw new Error("RESEND_API_KEY is not defined");
const resend = new Resend(resendApiKey);

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { email, password } = body;

        // Skip 2FA check for demo user - will be handled by frontend bypass
        if (email === "razorpay.demo@fitplaysolutions.com") {
            return NextResponse.json(
                { message: "Demo user detected - use frontend bypass" },
                { status: 200 }
            );
        }

        const isAdmin = await prisma.admin.findUnique({
            where: { email },
        });

        let existingUser;

        if (isAdmin) {
            existingUser = await prisma.admin.findUnique({
                where: { email },
            });
        }
        else {
            existingUser = await prisma.client.findUnique({
                where: { email },
            });

            if (!existingUser) {
                existingUser = await prisma.systemUser.findUnique({
                    where: { email },
                    include: { role: true }
                });
                if (!existingUser) {
                    return NextResponse.json(
                        { error: "User doesn't exists" },
                        { status: 400 }
                    );
                }
            }
        }

        if (!existingUser) {
            return NextResponse.json(
                { error: "User doesn't exists" },
                { status: 400 }
            );
        }

        const isCorrectPassword = await bcrypt.compare(
            password,
            existingUser.password
        );

        if (!isCorrectPassword) {
            return NextResponse.json(
                { error: "Incorrect password" },
                { status: 400 }
            );
        }

        function extractUserRole(user: any): Role {
            // Admin & Client → role is already the Role enum
            if (user.role && typeof user.role === "string") {
                return user.role as Role;
            }

            // SystemUser → SystemRole object. We convert it manually.
            return "SYSTEM_USER";
        }

        const userType = extractUserRole(existingUser);

        // send verification mail
        let otp = Math.floor(100000 + Math.random() * 900000).toString();

        let isOtpUnique = false;
        while (!isOtpUnique) {
            const existingToken = await prisma.loginToken.findUnique({
                where: { token: otp },
            });
            if (!existingToken) {
                isOtpUnique = true;
            }
            else {
                // regenerate otp
                otp = Math.floor(100000 + Math.random() * 900000).toString();
            }
        }

        console.log(`Generated verification token for ${existingUser.email}: ${otp}`);
        await prisma.loginToken.create({
            data: {
                identifier: existingUser.email,
                token: await bcrypt.hash(otp, 10),
                password: await bcrypt.hash(password, 10),
                userId: existingUser.id,
                userType: userType,
                expires: new Date(Date.now() + 1 * 60 * 60 * 1000),
            },
        });

        const verifyOtp = otp;
        const verificationMail = "no-reply@fitplaysolutions.com";

        try {
            const emailResult = await resend.emails.send({
                from: verificationMail,
                to: email,
                subject: "✅ Verify your Fitplay B2b portal account - Action Required",
                html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Verify your Fitplay B2b portal account</title>
                </head>
                <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f3f4f6;">
                    <div style="max-width: 600px; margin: 0 auto; background-color: white;">
                        <!-- Header -->
                        <div style="background: linear-gradient(135deg, #10B981 0%, #059669 100%); padding: 30px; text-align: center;">
                            <h1 style="color: white; margin: 0; font-size: 28px;">🎯 Welcome to FitPlay B2b Portal!</h1>
                        </div>
                        
                        <!-- Content -->
                        <div style="padding: 40px 30px; background-color: white;">
                            <p style="font-size: 18px; color: #1F2937; margin-bottom: 20px; font-weight: bold;">Hi ${existingUser.name}! 👋</p>
                            
                            <p style="font-size: 16px; color: #4B5563; margin-bottom: 30px; line-height: 1.6;">
                                To complete your login process use the following One-Time Password (OTP):
                            </p>

                            <div style="text-align: center; margin-bottom: 30px;">
                                <span style="display: inline-block; padding: 15px 25px; font-size: 24px; letter-spacing: 4px; background-color: #E0F2FE; color: #0369A1; border-radius: 8px; font-weight: bold; user-select: all;">${verifyOtp}</span>
                            </div>
                            <p style="font-size: 16px; color: #4B5563; margin-bottom: 30px; line-height: 1.6;">
                                This OTP is valid for the next 60 minutes. Please do not share it with anyone.
                            </p>
                        </div>

                        <!-- Footer -->
                        <div style="background-color: #F9FAFB; padding: 30px; text-align: center; border-top: 1px solid #E5E7EB;">
                            <p style="font-size: 14px; color: #6B7280; margin: 0 0 10px 0;">
                                If it wasn't you who requested this, please keep your mail safe and ignore this email.
                            </p>
                            <p style="font-size: 10px; color: #D1D5DB; margin: 10px 0 0 0;">
                                This email was sent to ${email}
                            </p>
                        </div>
                    </div>
                </body>
                </html>
                `,
            });
            console.log(
                `✅ Verification email sent successfully to ${email}. Email ID: ${emailResult.data?.id}`
            );
            console.log(`📧 From: ${verificationMail} | To: ${email}`);
        } catch (emailError) {
            console.error(
                `❌ Failed to send verification email to ${email}:`,
                emailError
            );
            console.error(`📧 Attempted from: ${verificationMail}`);
            // Don't fail the signup if email fails
        }
        return NextResponse.json({
            message: "Verify your email in an hour.",
        });
    } catch (err: any) {
        console.error("Signup error:", err);

        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

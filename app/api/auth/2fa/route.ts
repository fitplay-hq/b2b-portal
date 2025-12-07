import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { Resend } from "resend";
import { tree } from "next/dist/build/templates/app-page";
import { exit } from "process";

const resendApiKey = process.env.RESEND_API_KEY;
if (!resendApiKey) throw new Error("RESEND_API_KEY is not defined");
const resend = new Resend(resendApiKey);

function looksLikeEmail(value: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { email } = body;

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

        // send verification mail
        const verifyToken = crypto.randomUUID();
        await prisma.resetToken.create({
            data: {
                identifier: existingUser.email,
                token: verifyToken,
                expires: new Date(Date.now() + 1 * 60 * 60 * 1000),
            },
        });

        const baseUrl = process.env.NODE_ENV === "production" ? "https://portal.fitplaysolutions.com" :
            process.env.NEXTAUTH_URL ||
            "http://localhost:3000";
        const verifyLink = `${baseUrl}/verify?token=${verifyToken}`;
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
                                To complete your login process and start exploring our platform, please verify your email address by clicking the button below:
                            </p>
                            
                            <!-- CTA Button -->
                            <div style="text-align: center; margin: 40px 0;">
                                <a href="${verifyLink}" style="
                                    background: linear-gradient(135deg, #10B981 0%, #059669 100%);
                                    color: white;
                                    padding: 16px 32px;
                                    text-decoration: none;
                                    border-radius: 8px;
                                    font-weight: bold;
                                    font-size: 16px;
                                    display: inline-block;
                                    box-shadow: 0 4px 14px 0 rgba(16, 185, 129, 0.3);
                                    transition: all 0.2s;
                                ">
                                    ✅ Verify My Email Address
                                </a>
                            </div>
                            
                            <div style="background-color: #FEF3C7; padding: 20px; border-radius: 8px; border-left: 4px solid #F59E0B; margin: 30px 0;">
                                <p style="margin: 0; color: #92400E; font-size: 14px; font-weight: bold;">⚠️ Important:</p>
                                <p style="margin: 5px 0 0 0; color: #92400E; font-size: 14px;">This verification link will expire in 1 hour for security reasons.</p>
                            </div>
                            
                            <p style="font-size: 14px; color: #6B7280; margin: 20px 0;">
                                If the button doesn't work, copy and paste this link into your browser:
                            </p>
                            <p style="font-size: 12px; color: #9CA3AF; word-break: break-all; background-color: #F9FAFB; padding: 10px; border-radius: 4px;">
                                ${verifyLink}
                            </p>
                        </div>
                        
                        <!-- Footer -->
                        <div style="background-color: #F9FAFB; padding: 30px; text-align: center; border-top: 1px solid #E5E7EB;">
                            <p style="font-size: 14px; color: #6B7280; margin: 0 0 10px 0;">
                                If it wasn't you who requested this, please keep your mail safe and ignore this email.
                            </p>
                            <p style="font-size: 12px; color: #9CA3AF; margin: 0;">
                                © 2024 FitPlay.life - Transforming Health & Wellness Together 🌟
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

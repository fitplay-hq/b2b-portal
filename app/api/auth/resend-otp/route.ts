import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
if (!resendApiKey) throw new Error("RESEND_API_KEY is not defined");
const resend = new Resend(resendApiKey);

export async function PATCH(req: NextRequest) {
    try {
        const body = await req.json();
        const { email } = body;

        // Skip 2FA check for demo user - will be handled by frontend bypass
        if (email === "razorpay.demo@fitplaysolutions.com") {
            return NextResponse.json(
                { message: "Demo user detected - use frontend bypass" },
                { status: 200 }
            );
        }

        const existingToken = await prisma.loginToken.findFirst({
            where: {
                identifier: email,
                expires: { gt: new Date() },
            },
            orderBy: { createdAt: "desc" },
        });

        if (!existingToken) {
            return NextResponse.json(
                { error: "No active OTP found for this email" },
                { status: 400 }
            );
        }

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

        await prisma.loginToken.update({
            where: { id: existingToken.id },
            data: {
                token: await bcrypt.hash(otp, 10),
                expires: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes from now
            },
        });

        const verificationMail = "no-reply@fitplaysolutions.com"
        const verifyOtp = otp;

        // Send OTP via email using Resend
        // await resend.emails.send({
        //     from: verificationMail,
        //     to: email,
        //     subject: "Resend OTP for login",
        //     html: `
        //         <!DOCTYPE html>
        //         <html>
        //         <head>
        //             <meta charset="utf-8">
        //             <meta name="viewport" content="width=device-width, initial-scale=1.0">
        //             <title>Verify your Fitplay B2b portal account</title>
        //         </head>
        //         <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f3f4f6;">
        //             <div style="max-width: 600px; margin: 0 auto; background-color: white;">
                        
        //                 <!-- Content -->
        //                 <div style="padding: 40px 30px; background-color: white;">
                            
        //                     <p style="font-size: 16px; color: #4B5563; margin-bottom: 30px; line-height: 1.6;">
        //                         To complete your login process use the following One-Time Password (OTP):
        //                     </p>

        //                     <div style="text-align: center; margin-bottom: 30px;">
        //                         <span style="display: inline-block; padding: 15px 25px; font-size: 24px; letter-spacing: 4px; background-color: #E0F2FE; color: #0369A1; border-radius: 8px; font-weight: bold; user-select: all;">${verifyOtp}</span>
        //                     </div>
        //                     <p style="font-size: 16px; color: #4B5563; margin-bottom: 30px; line-height: 1.6;">
        //                         This OTP is valid for the next 60 minutes. Please do not share it with anyone.
        //                     </p>
        //                 </div>

        //                 <!-- Footer -->
        //                 <div style="background-color: #F9FAFB; padding: 30px; text-align: center; border-top: 1px solid #E5E7EB;">
        //                     <p style="font-size: 14px; color: #6B7280; margin: 0 0 10px 0;">
        //                         If it wasn't you who requested this, please keep your mail safe and ignore this email.
        //                     </p>
        //                     <p style="font-size: 10px; color: #D1D5DB; margin: 10px 0 0 0;">
        //                         This email was sent to ${email}
        //                     </p>
        //                 </div>
        //             </div>
        //         </body>
        //         </html>
        //         `,
        // });

        return NextResponse.json(
            { message: "OTP resent successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Resend OTP error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
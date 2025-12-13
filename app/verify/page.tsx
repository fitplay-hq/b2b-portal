"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { FitplayLogo } from "@/components/fitplay-logo";
import { signIn } from "next-auth/react";

function VerifyContent() {
  const [error, setError] = useState("");
  const [verifying, setVerifying] = useState(true);
  const [success, setSuccess] = useState(false);
  
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  useEffect(() => {
    if (token) {
      verifyToken();
    } else {
      setError("Invalid verification link");
      setVerifying(false);
    }
  }, [token]);

  const verifyToken = async () => {
    try {
      const response = await fetch(`/api/auth/verify?token=${token}`);
      const data = await response.json();

      if (response.ok && data.verified) {
        console.log("✅ Email verification successful, logging in user");
        
        // Use NextAuth signIn with special password for email-verified users
        const result = await signIn("credentials", {
          email: data.email,
          password: "EMAIL_VERIFIED", // Special flag for email verification flow
          redirect: false,
        });

        if (result?.error) {
          console.error("❌ Login after verification failed:", result.error);
          setError("Login failed after verification. Please try logging in manually.");
          setVerifying(false);
          return;
        }

        console.log("✅ User logged in successfully after email verification");
        setSuccess(true);
        setVerifying(false);
        
        // Redirect after showing success message
        setTimeout(() => {
          router.push("/");
        }, 1500);
      } else {
        setError(data.error || "Verification failed");
        setVerifying(false);
      }
    } catch (err) {
      console.error("Verification error:", err);
      setError("Verification failed. Please try again.");
      setVerifying(false);
    }
  };

  if (verifying) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Verifying Email</h2>
            <p className="text-gray-600">Please wait while we verify your email...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!success && error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Verification Failed</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => router.push("/login")} variant="outline">
              Back to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <Card className="shadow-xl">
            <CardContent className="p-8">
              <div className="text-center">
                <div className="flex justify-center mb-6">
                  <FitplayLogo size="3xl" className="mx-auto" />
                </div>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Successfully Verified!</h2>
                <p className="text-gray-600 mb-6">You have been logged in automatically. Redirecting to your portal...</p>
                
                <div className="w-8 h-8 border-3 border-neutral-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-sm text-gray-500">Please wait while we redirect you</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return null;
}

// Loading component for Suspense fallback
function VerifyLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading</h2>
          <p className="text-gray-600">Please wait...</p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<VerifyLoading />}>
      <VerifyContent />
    </Suspense>
  );
}
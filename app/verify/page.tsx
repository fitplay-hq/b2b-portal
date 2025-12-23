"use client";

import { useState, useEffect, Suspense, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, ArrowRight, Mail, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { FitplayLogo } from "@/components/fitplay-logo";
import { signIn } from "next-auth/react";
import { toast } from "sonner";

function VerifyOTPContent() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState("");
  const [countdown, setCountdown] = useState(0);
  
  const searchParams = useSearchParams();
  const router = useRouter();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (!emailParam) {
      setError("No email provided. Please restart the login process.");
      return;
    }
    setEmail(emailParam);
    // Start countdown immediately when page loads
    setCountdown(60);
  }, [searchParams]);

  // Countdown timer effect
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return; // Only allow single digit
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    const newOtp = [...otp];
    
    for (let i = 0; i < pastedData.length && i < 6; i++) {
      if (/^\d$/.test(pastedData[i])) {
        newOtp[i] = pastedData[i];
      }
    }
    setOtp(newOtp);
  };

  const verifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const otpString = otp.join("");
    if (otpString.length !== 6) {
      setError("Please enter all 6 digits");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp: otpString }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "OTP verification failed");
        setLoading(false);
        return;
      }

      console.log("✅ OTP verification successful, logging in user");
      
      // Use NextAuth signIn with special password for OTP-verified users
      const result = await signIn("credentials", {
        email: email,
        password: "OTP_VERIFIED", // Special flag for OTP verification flow
        redirect: false,
      });

      if (result?.error) {
        console.error("❌ Login after OTP verification failed:", result.error);
        setError("Login failed after verification. Please try logging in manually.");
        setLoading(false);
        return;
      }

      console.log("✅ User logged in successfully after OTP verification");
      setSuccess(true);
      setLoading(false);
      
      // Redirect after showing success message
      setTimeout(() => {
        router.push("/");
      }, 1500);
    } catch (err) {
      console.error("OTP verification error:", err);
      setError("Verification failed. Please try again.");
      setLoading(false);
    }
  };

  const resendOTP = async () => {
    if (countdown > 0) return;
    
    try {
      const response = await fetch('/api/auth/resend-otp', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setCountdown(60);
        toast.success('OTP resent successfully!');
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to resend OTP. Please try again.');
      }
    } catch (error) {
      console.error('Resend error:', error);
      toast.error('An error occurred while resending OTP.');
    }
  };

  if (!email) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Invalid Access</h2>
            <p className="text-gray-600 mb-4">No email provided. Please restart the login process.</p>
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
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Login Successful!</h2>
                <p className="text-gray-600 mb-6">You have been logged in successfully. Redirecting to your portal...</p>
                
                <div className="w-8 h-8 border-3 border-neutral-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-sm text-gray-500">Please wait while we redirect you</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-xl">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-6">
                <FitplayLogo size="3xl" className="mx-auto" />
              </div>
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Enter Verification Code</h2>
              <p className="text-gray-600">
                We've sent a 6-digit code to<br />
                <span className="font-medium">{email}</span>
              </p>
            </div>

            <form onSubmit={verifyOTP} className="space-y-6">
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter 6-digit code
                </Label>
                <div className="flex gap-2 justify-center" onPaste={handlePaste}>
                  {otp.map((digit, index) => (
                    <Input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-12 h-12 text-center text-lg font-semibold border-2 focus:border-blue-500 focus:ring-blue-500"
                    />
                  ))}
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-neutral-700 to-neutral-800 hover:from-neutral-800 hover:to-neutral-900"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Verifying...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    Verify & Login
                    <ArrowRight className="h-4 w-4" />
                  </div>
                )}
              </Button>

              <div className="text-center space-y-4">
                <button
                  type="button"
                  onClick={resendOTP}
                  disabled={loading || countdown > 0}
                  className={`text-sm transition-colors ${
                    countdown > 0 
                      ? 'text-gray-400 cursor-not-allowed' 
                      : 'text-blue-600 hover:text-blue-800 hover:underline'
                  }`}
                >
                  {countdown > 0 
                    ? `Resend OTP in ${countdown}s` 
                    : "Didn't receive code? Resend OTP"
                  }
                </button>

                <button
                  type="button"
                  onClick={() => router.push("/login")}
                  className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800 mx-auto transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Login
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
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
      <VerifyOTPContent />
    </Suspense>
  );
}
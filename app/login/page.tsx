"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Package, Shield, Users, TrendingUp, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { ImageWithFallback } from "@/components/image";
import { FitplayLogo } from "@/components/fitplay-logo";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const router = useRouter();

  const handleEmailVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validate both email and password are provided
    if (!email || !password) {
      setError("Please provide both email and password");
      setLoading(false);
      return;
    }

    try {
      // Special case: Razorpay demo client - direct authentication bypass
      if (email === "razorpay.demo@fitplaysolutions.com" && password === "test@2025") {
        console.log("🚀 Razorpay demo client - direct authentication");
        
        const result = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        if (result?.error) {
          setError("Demo authentication failed. Please check credentials.");
        } else {
          console.log("✅ Demo authentication successful, redirecting...");
          // Force redirect to client portal
          window.location.replace("/client");
          return;
        }
      } else {
        // Regular flow - send verification email
        const response = await fetch("/api/auth/2fa", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.error || "Failed to send verification email");
        } else {
          setEmailSent(true);
        }
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: Package, text: "Streamlined Product Catalog" },
    { icon: Shield, text: "Secure B2B Transactions" },
    { icon: Users, text: "Multi-Client Management" },
    { icon: TrendingUp, text: "Real-time Order Tracking" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-neutral-100">
      <div className="min-h-screen flex">
        {/* Left Panel */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-neutral-700 via-neutral-800 to-neutral-900"
        >
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 25% 25%, white 2px, transparent 2px), radial-gradient(circle at 75% 75%, white 2px, transparent 2px)",
                backgroundSize: "50px 50px",
              }}
            />
          </div>

          <div className="absolute inset-0 mix-blend-overlay opacity-20">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1758630737900-a28682c5aa69?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080"
              alt="Modern office workspace"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="relative z-10 flex flex-col px-12 py-16 text-white">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="flex mb-8"
            >
              <FitplayLogo variant="white" size="4xl" showText textColor="light" spacing="tight" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="mb-8"
            >
              <h2 className="text-4xl font-bold leading-tight mb-4">
                Streamline Your
                <br />
                Corporate Ordering
              </h2>
              <p className="text-xl text-neutral-300 leading-relaxed">
                Efficient procurement management for corporate solutions. Access exclusive
                pricing, manage bulk orders, and track deliveries seamlessly.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="space-y-4"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                  className="flex items-center gap-3"
                >
                  <div className="p-2 bg-white/10 backdrop-blur-sm rounded-lg">
                    <feature.icon className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-neutral-300">{feature.text}</span>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="mt-12 pt-8 border-t border-white/20"
            >
              <div className="grid grid-cols-3 gap-8">
                <div>
                  <div className="text-2xl font-bold">200+</div>
                  <div className="text-neutral-400 text-sm">Corporate Clients</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">10K+</div>
                  <div className="text-neutral-400 text-sm">Orders Processed</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">99.9%</div>
                  <div className="text-neutral-400 text-sm">Uptime</div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Right Panel */}
        <div className="w-full lg:w-1/2 flex items-center lg:justify-center p-8">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-md"
          >
            <div className="lg:hidden mb-8">
              <FitplayLogo variant="black" size="4xl" showText textColor="dark" spacing="tight" />
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-neutral-900 mb-2">Welcome Back</h2>
                    <p className="text-gray-600">
                      Sign in to access your corporate ordering portal
                    </p>
                  </div>

                  {emailSent ? (
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                        <Package className="h-8 w-8 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Check Your Inbox</h3>
                        <p className="text-gray-600 mt-2">
                          We've sent a verification link to <br />
                          <span className="font-medium">{email}</span>
                        </p>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-sm text-blue-800">
                          Click the link in your email to verify your account and continue to login.
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setEmailSent(false);
                          setEmail("");
                        }}
                        className="w-full"
                      >
                        Use Different Email
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleEmailVerification} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-gray-700 font-medium">
                          Email Address
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email address"
                          className="h-12 border-gray-200 focus:border-neutral-500 focus:ring-neutral-500"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="password" className="text-gray-700 font-medium">
                            Password
                          </Label>
                          <button
                            type="button"
                            onClick={() => router.push('/forgot-password')}
                            className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                          >
                            Forgot Password?
                          </button>
                        </div>
                        <Input
                          id="password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter your password"
                          className="h-12 border-gray-200 focus:border-neutral-500 focus:ring-neutral-500"
                          required
                        />
                      </div>


                    {error && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <Alert
                          variant="destructive"
                          className="border-red-200 bg-red-50"
                        >
                          <AlertDescription className="text-red-700">
                            {error}
                          </AlertDescription>
                        </Alert>
                      </motion.div>
                    )}

                      <Button
                        type="submit"
                        className="w-full h-12 bg-gradient-to-r from-neutral-700 to-neutral-800 hover:from-neutral-800 hover:to-neutral-900 text-white font-medium transition-all duration-200 transform hover:scale-[1.02]"
                        disabled={loading}
                      >
                        {loading ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            {email === "razorpay.demo@fitplaysolutions.com" && password === "test@2025" 
                              ? "Logging in as Demo..." 
                              : "Sending Email..."}
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            Verify Email
                            <ArrowRight className="h-4 w-4" />
                          </div>
                        )}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-center mt-8 text-sm text-neutral-500"
            >
              <p>© 2025 Fitplay International LLP</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

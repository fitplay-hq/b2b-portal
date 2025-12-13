"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Package,
  Shield,
  Users,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { ImageWithFallback } from "@/components/image";
import { FitplayLogo } from "@/components/fitplay-logo";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    companyName: "",
  });
  const [error, setError] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      // TODO: Implement signup API call
      // For now, just redirect to login
      alert("Signup functionality not implemented yet. Redirecting to login.");
      router.push("/login");
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
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-neutral-50 to-neutral-100">
      <div className="min-h-screen flex">
        {/* Left Panel - Branding & Features */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-neutral-700 via-neutral-800 to-neutral-900"
        >
          {/* Background Pattern */}
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

          {/* Background Image */}
          <div className="absolute inset-0 mix-blend-overlay opacity-20">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1758630737900-a28682c5aa69?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBvZmZpY2UlMjB3b3Jrc3BhY2UlMjBidXNpbmVzcyUyMGNvcnBvcmF0ZXxlbnwxfHx8fDE3NTg4ODcxMTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Modern office workspace"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="relative z-10 flex flex-col px-12 py-16 text-white">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="flex mb-8"
            >
              <FitplayLogo variant="white" size="4xl" showText textColor="light" />
            </motion.div>

            {/* Main Heading */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="mb-8"
            >
              <h2 className="text-4xl font-bold leading-tight mb-4">
                Join Our
                <br />
                Corporate Network
              </h2>
              <p className="text-xl text-neutral-300 leading-relaxed">
                Create your account and start streamlining your procurement
                process. Access exclusive pricing and manage orders efficiently.
              </p>
            </motion.div>

            {/* Features */}
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

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="mt-12 pt-8 border-t border-white/20"
            >
              <div className="grid grid-cols-3 gap-8">
                <div>
                  <div className="text-2xl font-bold">500+</div>
                  <div className="text-neutral-400 text-sm">
                    Corporate Clients
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold">10K+</div>
                  <div className="text-neutral-400 text-sm">
                    Orders Processed
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold">99.9%</div>
                  <div className="text-neutral-400 text-sm">Uptime</div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Right Panel - Signup Form */}
        <div className="w-full lg:w-1/2 flex items-center lg:justify-center p-8">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-md"
          >
            {/* Mobile Logo */}
            <div className="lg:hidden mb-8">
              <FitplayLogo variant="black" size="4xl" showText textColor="dark" />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-neutral-900 mb-2">
                      Create Account
                    </h2>
                    <p className="text-gray-600">
                      Join the B2B ordering platform
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="firstName"
                          className="text-gray-700 font-medium"
                        >
                          First Name
                        </Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          type="text"
                          value={formData.firstName}
                          onChange={handleChange}
                          placeholder="John"
                          className="h-12 border-gray-200 focus:border-neutral-500 focus:ring-neutral-500"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="lastName"
                          className="text-gray-700 font-medium"
                        >
                          Last Name
                        </Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          type="text"
                          value={formData.lastName}
                          onChange={handleChange}
                          placeholder="Doe"
                          className="h-12 border-gray-200 focus:border-neutral-500 focus:ring-neutral-500"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="email"
                        className="text-gray-700 font-medium"
                      >
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john.doe@company.com"
                        className="h-12 border-gray-200 focus:border-neutral-500 focus:ring-neutral-500"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="companyName"
                        className="text-gray-700 font-medium"
                      >
                        Company Name
                      </Label>
                      <Input
                        id="companyName"
                        name="companyName"
                        type="text"
                        value={formData.companyName}
                        onChange={handleChange}
                        placeholder="ACME Corporation"
                        className="h-12 border-gray-200 focus:border-neutral-500 focus:ring-neutral-500"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="password"
                        className="text-gray-700 font-medium"
                      >
                        Password
                      </Label>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Create a strong password"
                        className="h-12 border-gray-200 focus:border-neutral-500 focus:ring-neutral-500"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="confirmPassword"
                        className="text-gray-700 font-medium"
                      >
                        Confirm Password
                      </Label>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm your password"
                        className="h-12 border-gray-200 focus:border-neutral-500 focus:ring-neutral-500"
                        required
                      />
                    </div>

                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
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
                          Creating Account...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          Create Account
                          <ArrowRight className="h-4 w-4" />
                        </div>
                      )}
                    </Button>
                  </form>

                  {/* Login Link */}
                  <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                      Already have an account?{" "}
                      <button
                        onClick={() => router.push("/login")}
                        className="text-neutral-700 hover:text-neutral-800 font-medium"
                      >
                        Sign in here
                      </button>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="text-center mt-8 text-sm text-neutral-500"
            >
              <p>© 2024 B2B Portal. Professional Business Solutions.</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const [role, setRole] = useState<"clients" | "admin">("clients");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await signIn(role, {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError(res.error);
    } else {
      router.push("/");
      console.log("User signed in:", { email, role });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-md w-96 space-y-4"
      >
        <h1 className="text-xl font-semibold text-center">Sign In</h1>

        <div className="flex justify-center space-x-4">
          <button
            type="button"
            className={`px-3 py-1 rounded-lg ${
              role === "clients" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setRole("clients")}
          >
            Client
          </button>
          <button
            type="button"
            className={`px-3 py-1 rounded-lg ${
              role === "admin" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setRole("admin")}
          >
            Admin
          </button>
        </div>

        <input
          type="email"
          placeholder="Email"
          className="w-full px-3 py-2 border rounded-lg"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full px-3 py-2 border rounded-lg"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          Sign In
        </button>
      </form>
    </div>
  );
}

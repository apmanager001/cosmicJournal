"use client";
import LoginForm from "../../comp/auth/LoginForm";

export default function LoginPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: `url('/cosmic2.svg') repeat-y center center`,
        backgroundSize: "100% auto",
        zIndex: 1,
      }}
    >
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white/30 mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600">
            Sign in to your Cosmic Journal account
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}


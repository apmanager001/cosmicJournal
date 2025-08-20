"use client";
import RegisterForm from "../../comp/auth/RegisterForm";

export default function RegisterPage() {
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
            Create Account
          </h1>
          <p className="text-gray-600">
            Join Cosmic Journal and start your journey
          </p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}




"use client";
import RegisterForm from "../../comp/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="flex items-center justify-center md:p-4">
      <div className="customContainer min-h-screen md:min-h-24">
        <div className="max-w-md w-full p-12">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold  mb-2">Create Account</h1>
            <p className="text-primary">
              Join Cosmic Journal and start your journey
            </p>
          </div>
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}























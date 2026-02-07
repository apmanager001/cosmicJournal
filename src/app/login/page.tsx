"use client";
import LoginForm from "../../comp/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center md:p-4 ">
      <div className="customContainer min-h-screen md:min-h-24">
        <div className="max-w-md w-full p-12">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">
              Welcome Back
            </h1>
            <p className="text-primary">
              Sign in to your Cosmic Journal account
            </p>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}


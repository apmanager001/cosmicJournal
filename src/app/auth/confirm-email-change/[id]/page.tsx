"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { pb } from "@/comp/utility/tanstack/pocketbase";

export default function ConfirmEmailChangePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [status, setStatus] = useState<
    "loading" | "password" | "success" | "error"
  >("loading");
  const [message, setMessage] = useState("");
  const [oldEmail, setOldEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Unwrap the params Promise
  const resolvedParams = use(params);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;

    setIsSubmitting(true);
    try {
      const token = resolvedParams.id;
      console.log("Attempting to confirm verification with token:", token);

      // Use confirmVerification with the provided password
      await pb.collection("users").confirmEmailChange(token, password);
      console.log("Email verification successful via confirmVerification");

      setStatus("success");
      setMessage("Your email has been successfully updated!");

      // Refresh auth to get the new email
      await pb.collection("users").authRefresh();
    } catch (error: unknown) {
      console.log("confirmVerification failed:", error);
      setStatus("error");
      setMessage(
        "Email change confirmation failed. Please check your password and try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const confirmEmailChange = async () => {
      try {
        const token = resolvedParams.id;

        if (!token) {
          setStatus("error");
          setMessage(
            "Invalid confirmation link. Please try requesting a new email change."
          );
          return;
        }

        // Extract email information from the token (JWT payload)
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          setOldEmail(payload.email || "your previous email");
          setNewEmail(payload.newEmail || "your new email");
        } catch (parseError) {
          console.log("Could not parse token payload:", parseError);
        }

        // Confirm the email change with PocketBase
        // The token contains the necessary information to confirm the email change
        // We need to use the correct method for email change confirmation

        // Check if user is currently authenticated
        const isAuthenticated = pb.authStore.isValid;
        console.log("User authenticated:", isAuthenticated);

        try {
          // Decode the JWT token to get user info for display purposes
          const decodedToken = JSON.parse(atob(token.split(".")[1]));
          console.log("Decoded token:", decodedToken);

          // The token from requestEmailChange should work with confirmEmailChange
          // However, if that fails, we'll need to handle it differently
          try {
            // Try the standard confirmEmailChange method first
            // Note: This method requires the user to be authenticated and provide their current password
            const sessionUser = pb.authStore.model;
            const decoded = JSON.parse(atob(token.split(".")[1]));
            if (
              !sessionUser ||
              sessionUser.id !== decoded.id ||
              sessionUser.email !== decoded.email
            ) {
              throw new Error(
                "Email change confirmation requires you to be logged in as the original account. Please log in with your current email and try again."
              );
            }

            // We need the user's password to confirm the email change
            // Set status to password to show the password input form
            setStatus("password");
            return;
          } catch (error: unknown) {
            console.log("Email change confirmation failed:", error);

            // Handle the error based on its type
            if (error instanceof Error) {
              throw error; // Re-throw our custom error messages
            } else {
              // For unexpected errors, provide a general message
              throw new Error(
                "Email change confirmation failed. This could be due to:\n" +
                  "1. The confirmation link has expired\n" +
                  "2. The confirmation link is invalid\n" +
                  "3. A technical issue with the confirmation process\n\n" +
                  "Please request a new email change from the settings page."
              );
            }
          }
        } catch (error: unknown) {
          const errorObj = error as {
            response?: { data?: unknown };
            status?: number;
            message?: string;
          };
          throw error;
        }

        setStatus("success");
        setMessage("Your email has been successfully updated!");

        // Refresh auth to get the new email
        await pb.collection("users").authRefresh();
      } catch (error: unknown) {
        const errorObj = error as { status?: number };
        console.error("Email change confirmation error:", error);
        setStatus("error");

        if (errorObj.status === 400) {
          setMessage(
            "The confirmation link has expired or is invalid. Please request a new email change."
          );
        } else if (errorObj.status === 404) {
          setMessage("User not found. Please make sure you're logged in.");
        } else {
          setMessage(
            "An error occurred while confirming your email change. Please try again."
          );
        }
      }
    };

    confirmEmailChange();
  }, [resolvedParams.id]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md w-full text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Confirming Email Change
          </h1>
          <p className="text-white/80">
            Please wait while we process your request...
          </p>
        </div>
      </div>
    );
  }

  if (status === "password") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-4">
            Enter Your Password
          </h1>
          <p className="text-white/80 mb-6">
            To confirm your email change from{" "}
            <span className="font-semibold">{oldEmail}</span> to{" "}
            <span className="font-semibold">{newEmail}</span>, please enter your
            current password.
          </p>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting || !password.trim()}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Confirming..." : "Confirm Email Change"}
            </button>
          </form>
          <div className="mt-6">
            <Link
              href="/settings"
              className="text-white/60 hover:text-white text-sm underline"
            >
              Back to Settings
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md w-full text-center">
        {status === "success" ? (
          <>
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white mb-4">
              Email Updated Successfully!
            </h1>
            <p className="text-white/80 mb-6">
              Your email has been changed from{" "}
              <span className="font-semibold">{oldEmail}</span> to{" "}
              <span className="font-semibold">{newEmail}</span>.
            </p>
            <p className="text-white/60 text-sm mb-8">
              You can now use your new email address to log in to your account.
              Please log out and log back in with your new email address.
            </p>
            <Link
              href="/settings"
              className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
            >
              Go to Settings
            </Link>
          </>
        ) : (
          <>
            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white mb-4">
              Email Change Failed
            </h1>
            <p className="text-white/80 mb-6">{message}</p>
            <div className="space-y-3">
              <Link
                href="/settings"
                className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
              >
                Back to Settings
              </Link>
              <div className="text-center">
                <Link
                  href="/settings"
                  className="text-white/60 hover:text-white text-sm underline"
                >
                  Try requesting email change again
                </Link>
              </div>
              {message.includes("authentication") && (
                <div className="text-center mt-4">
                  <Link
                    href="/login"
                    className="text-white/60 hover:text-white text-sm underline"
                  >
                    Log in to your account
                  </Link>
                </div>
              )}
              {message.includes("password") && (
                <div className="text-center mt-4">
                  <Link
                    href="/settings"
                    className="text-white/60 hover:text-white text-sm underline"
                  >
                    Go to Settings to change email
                  </Link>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

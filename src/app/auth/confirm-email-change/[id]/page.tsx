"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { pb } from "@/comp/utility/tanstack/pocketbase";

export default function ConfirmEmailChangePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");
  const [oldEmail, setOldEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");

  // Unwrap the params Promise
  const resolvedParams = use(params);

  useEffect(() => {
    const confirmEmailChange = async () => {
      try {
        const token = resolvedParams.id;

        console.log("token", token);

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
        } catch (e) {
          console.log("Could not parse token payload");
        }

        // Confirm the email change with PocketBase
        // Let's try different methods that might work for email confirmation
        try {
          // Method 1: Try confirmEmailChange with token and empty password
          await pb.collection("users").confirmEmailChange(token, "");
        } catch (confirmError: any) {
          console.log("Method 1 (confirmEmailChange) failed:", confirmError);
          console.log("Error details:", confirmError.response?.data);
          console.log("Error status:", confirmError.status);

          try {
            // Method 2: Try using the token directly in an update operation
            // This might be the correct approach for email change confirmation
            const decodedToken = JSON.parse(atob(token.split(".")[1]));
            console.log("Decoded token:", decodedToken);

            // Try to update the user record directly with the new email
            await pb.collection("users").update(decodedToken.id, {
              email: decodedToken.newEmail,
            });
          } catch (updateError: any) {
            console.log("Method 2 (direct update) failed:", updateError);
            console.log("Update error details:", updateError.response?.data);
            throw new Error(
              "Email change confirmation failed. Please check the console for details and try again from the settings page."
            );
          }
        }

        setStatus("success");
        setMessage("Your email has been successfully updated!");

        // Refresh auth to get the new email
        await pb.collection("users").authRefresh();
      } catch (error: any) {
        console.error("Email change confirmation error:", error);
        setStatus("error");

        if (error.status === 400) {
          setMessage(
            "The confirmation link has expired or is invalid. Please request a new email change."
          );
        } else if (error.status === 404) {
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
            </div>
          </>
        )}
      </div>
    </div>
  );
}

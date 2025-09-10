"use client";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { pb } from "../../../comp/utility/tanstack/pocketbase";
import { useAuth } from "../../../comp/utility/tanstack/authContext";

const OAuthCallbackContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshUser } = useAuth();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        // Get the OAuth data from URL parameters
        const code = searchParams.get("code");
        const state = searchParams.get("state");
        const error = searchParams.get("error");

        if (error) {
          throw new Error(`OAuth error: ${error}`);
        }

        if (!code) {
          throw new Error("No authorization code received");
        }

        // Complete the OAuth flow with PocketBase
        const authData = await pb.collection("users").authWithOAuth2({
          provider: "google", // This will be dynamic based on the provider
          code: code,
          codeVerifier: state, // PocketBase uses state as codeVerifier
        });

        if (authData) {
          // Refresh user data in context
          await refreshUser();
          setStatus("success");

          // Redirect to dashboard after successful authentication
          setTimeout(() => {
            router.push("/dashboard");
          }, 1000);
        }
      } catch (error) {
        console.error("OAuth callback error:", error);
        setErrorMessage(
          error instanceof Error ? error.message : "Authentication failed"
        );
        setStatus("error");

        // Redirect to login page after error
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      }
    };

    handleOAuthCallback();
  }, [searchParams, router, refreshUser]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="bg-white/20 rounded-lg shadow-xl p-8 backdrop-blur-sm text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-white mb-2">
            Completing Authentication
          </h2>
          <p className="text-white/80">Please wait while we sign you in...</p>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="bg-white/20 rounded-lg shadow-xl p-8 backdrop-blur-sm text-center">
          <div className="text-green-400 text-6xl mb-4">✓</div>
          <h2 className="text-xl font-semibold text-white mb-2">
            Authentication Successful!
          </h2>
          <p className="text-white/80">Redirecting you to the dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="bg-white/20 rounded-lg shadow-xl p-8 backdrop-blur-sm text-center">
        <div className="text-red-400 text-6xl mb-4">✗</div>
        <h2 className="text-xl font-semibold text-white mb-2">
          Authentication Failed
        </h2>
        <p className="text-white/80 mb-4">{errorMessage}</p>
        <p className="text-white/60 text-sm">
          Redirecting you to the login page...
        </p>
      </div>
    </div>
  );
};

const OAuthCallback = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
          <div className="bg-white/20 rounded-lg shadow-xl p-8 backdrop-blur-sm text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-white mb-2">
              Loading...
            </h2>
            <p className="text-white/80">Please wait...</p>
          </div>
        </div>
      }
    >
      <OAuthCallbackContent />
    </Suspense>
  );
};

export default OAuthCallback;

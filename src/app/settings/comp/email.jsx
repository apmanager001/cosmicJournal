import React, { useState } from "react";
import { useAuth } from "@/comp/utility/tanstack/authContext";

const EmailSettings = () => {
  const { user, requestEmailVerification, updateUserEmail } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [newEmail, setNewEmail] = useState(user?.email || "");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleResendVerification = async () => {
    if (!user?.email) return;

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      await requestEmailVerification(user.email);
      setSuccess("Verification email sent successfully!");
    } catch (err) {
      setError("Failed to send verification email. Please try again.");
      console.error("Verification email error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateEmail = async () => {
    if (!newEmail || newEmail === user?.email) {
      setIsEditing(false);
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const result = await updateUserEmail(newEmail);
      if (result.success) {
        setSuccess(result.message);
        setIsEditing(false);
      } else {
        setError("Failed to request email change. Please try again.");
      }
    } catch (err) {
      if (err.message?.includes("unique")) {
        setError(
          "This email is already in use. Please choose a different one."
        );
      } else if (err.message?.includes("validation failed")) {
        setError(
          "Email validation failed. Please check the email format and try again."
        );
      } else if (err.message?.includes("not authenticated")) {
        setError("Authentication error. Please log out and log back in.");
      } else if (err.message?.includes("same as current")) {
        setError("New email is the same as current email.");
      } else {
        setError("Failed to update email. Please try again.");
      }
      console.error("Update email error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setNewEmail(user?.email || "");
    setError("");
    setSuccess("");
    setIsEditing(false);
  };

  const getVerificationBadge = () => {
    if (user?.verified) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          ✓ Verified
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          ✗ Not Verified
        </span>
      );
    }
  };

  return (
    <div className="space-y-4 w-full">
      <div>
        <h3 className="font-medium text-gray-900 dark:text-gray-100">Email</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Manage your email address and verification status
        </p>
      </div>

      {/* Current Email Display */}
      <div className="flex flex-col md:flex-row gap-2 md:gap-0 md:items-center justify-between w-full">
        <div className="flex items-center space-x-3">
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {user?.email}
          </span>
        </div>

        {!user?.verified && (
          <div className="flex items-center space-x-3">
            <button
              onClick={handleResendVerification}
              disabled={isLoading}
              className="cursor-pointer inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Sending..." : "Resend Verification"}
            </button>
            {getVerificationBadge()}
          </div>
        )}
      </div>

      {/* Email Editing */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
            Change Email Address
          </h4>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="cursor-pointer text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Edit
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={handleUpdateEmail}
                disabled={isLoading || !newEmail || newEmail === user?.email}
                className="text-sm text-green-600 hover:text-green-500 dark:text-green-400 dark:hover:text-green-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save
              </button>
              <button
                onClick={handleCancelEdit}
                disabled={isLoading}
                className="cursor-pointer text-sm text-gray-600 hover:text-gray-500 dark:text-gray-400 dark:hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {isEditing && (
          <div className="space-y-3">
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="Enter new email address"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              A confirmation email will be sent to your new email address. Click
              the link in the email to complete the change.
            </p>
          </div>
        )}
      </div>

      {/* Status Messages */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3">
          <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md p-3">
          <p className="text-sm text-green-800 dark:text-green-200">
            {success}
          </p>
        </div>
      )}
    </div>
  );
};

export default EmailSettings;

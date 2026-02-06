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
        <h3 className="font-medium ">Email</h3>
        <p className="text-sm text-base-content/40 mt-1">
          Manage your email address and verification status
        </p>
      </div>

      {/* Current Email Display */}
      <div className="flex flex-col md:flex-row gap-2 md:gap-0 md:items-center justify-between w-full">
        <div className="flex items-center space-x-3">
          <span className="text-sm font-medium">
            {user?.email}
          </span>
        </div>

        {!user?.verified && (
          <div className="flex items-center space-x-3">
            <button
              onClick={handleResendVerification}
              disabled={isLoading}
              className="btn btn-primary btn-sm"
            >
              {isLoading ? "Sending..." : "Resend Verification"}
            </button>
            {getVerificationBadge()}
          </div>
        )}
        {user?.verified && (
            <>
            {getVerificationBadge()}
            </>
        )}
      </div>

      {/* Email Editing */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-base-content/60">
            Change Email Address
          </h4>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="hover:underline hover:text-gray-400 cursor-pointer"
            >
              Edit
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={handleUpdateEmail}
                disabled={isLoading || !newEmail || newEmail === user?.email}
                className="btn btn-success btn-sm "
              >
                Save
              </button>
              <button
                onClick={handleCancelEdit}
                disabled={isLoading}
                className="btn btn-error btn-sm"
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
              id='email'
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="Enter new email address"
              className="w-full input input-success"
              autoComplete="email"
            />
            <p className="text-xs text-base-content/60">
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
